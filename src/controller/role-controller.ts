import { Request, Response, NextFunction } from "express";
import db from "../models";
import {
  RoleAttributes,
  StaffAgencyBranchInChargeAttributes,
  StaffRoleAttributes,
} from "@/src/ts/interfaces/app_interfaces";
const { Role, StaffRole, StaffAgencyBranchInCharge } = db;
const { v4: uuidv4 } = require("uuid");
import { handleFormatUpdateDataByValidValue } from "../../src/common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
class RoleController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const roleList = await Role.findAll();
      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, roleList));
    } catch (err) {
      next(err);
    }
  }
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { role_title, role_description } = req.body;

      const foundRole = await Role.findOne({
        where: {
          role_title,
        },
      });

      if (foundRole) {
        res
          .status(STATUS_CODE.STATUS_CODE_409)
          .send(
            RestFullAPI.onSuccess(
              STATUS_MESSAGE.CONFLICT,
              "Role is already exist!"
            )
          );
      } else {
        const roleID: string = uuidv4();
        const newRoleRow: RoleAttributes = {
          id: roleID,
          role_title,
          role_description,
        };

        await Role.create(newRoleRow);
        res
          .status(STATUS_CODE.STATUS_CODE_200)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
      }
    } catch (err) {
      next(err);
    }
  }
  public static async updateByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { role_title, role_description } = req.body;

      const foundRole = await Role.findOne({
        where: {
          id,
        },
      });

      const roleRowUpdate: RoleAttributes = handleFormatUpdateDataByValidValue(
        {
          role_title,
          role_description,
        },
        foundRole.dataValues
      );

      await Role.update(roleRowUpdate, {
        where: {
          id,
        },
      });

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
  public static async deleteByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      interface QueryStaffRoleAttributes extends StaffRoleAttributes {
        StaffAgencyBranchInCharges: Array<{
          dataValues: StaffAgencyBranchInChargeAttributes;
        }>;
      }
      interface StaffRoleItemAttributes {
        dataValues: QueryStaffRoleAttributes;
      }

      const staffRoleList: Array<StaffRoleItemAttributes> =
        await StaffRole.findAll({
          where: {
            role_id: id,
          },
          include: [
            {
              model: StaffAgencyBranchInCharge,
            },
          ],
        });

      interface DeleteDataRowAttributes {
        staffRoleDeleteRowArr: Array<string>;
        staffAgencyBrachInChargeRowArr: Array<string>;
      }
      const {
        staffRoleDeleteRowArr,
        staffAgencyBrachInChargeRowArr,
      }: DeleteDataRowAttributes = staffRoleList.reduce(
        (
          result: DeleteDataRowAttributes,
          StaffRoleIncludeStaffAgencyInCharge: StaffRoleItemAttributes
        ) => {
          const { id, StaffAgencyBranchInCharges } =
            StaffRoleIncludeStaffAgencyInCharge.dataValues;

          StaffAgencyBranchInCharges.forEach((StaffAgencyBranchInCharge) => {
            const { id } = StaffAgencyBranchInCharge.dataValues;
            result.staffAgencyBrachInChargeRowArr.push(id);
          });
          result.staffRoleDeleteRowArr.push(id);
          return result;
        },
        {
          staffRoleDeleteRowArr: [],
          staffAgencyBrachInChargeRowArr: [],
        }
      );

      await Role.destroy({
        where: {
          id,
        },
      });
      await StaffRole.destroy({
        where: { id: staffRoleDeleteRowArr },
      });
      await StaffAgencyBranchInCharge.destroy({
        where: { id: staffAgencyBrachInChargeRowArr },
      });
      res
        .status(STATUS_CODE.STATUS_CODE_202)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
}

export default RoleController;
