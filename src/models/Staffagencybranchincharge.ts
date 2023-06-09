"use strict";
import { Model } from "sequelize";
import { StaffAgencyBranchInChargeAttributes } from "@/src/ts/interfaces/app_interfaces";
export default (sequelize: any, DataTypes: any) => {
  class StaffAgencyBranchInCharge
    extends Model<StaffAgencyBranchInChargeAttributes>
    implements StaffAgencyBranchInChargeAttributes
  {
    id!: string;
    staff_role_id!: string;
    agency_branch_id!: string;
    static associate({ StaffRole, AgencyBranch }: any) {
      StaffAgencyBranchInCharge.belongsTo(StaffRole, {
        foreignKey: "staff_role_id",
        as: "Staff_Agency_Branch_InCharge",
      });
      StaffAgencyBranchInCharge.belongsTo(AgencyBranch, {
        foreignKey: "agency_branch_id",
      });
    }
  }
  StaffAgencyBranchInCharge.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      staff_role_id: { type: DataTypes.UUID },
      agency_branch_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "StaffAgencyBranchInCharge",
    }
  );
  return StaffAgencyBranchInCharge;
};
