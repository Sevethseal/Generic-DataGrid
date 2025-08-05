import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/db";


interface ItemAttributes {
  id: number;
  Brand: string;
  Model: string;
  AccelSec: number;
  TopSpeed_KmH: number;
  Range_Km: number;
  Efficiency_WhKm: number;
  FastCharge_KmH: number;
  RapidCharge: string;
  PowerTrain: string;
  PlugType: string;
  BodyStyle: string;
  Segment: string;
  Seats: number;
  PriceEuro: number;
  Date: Date;
}
// Optional fields for creation
type ItemCreationAttributes = Optional<ItemAttributes, "id">;

class Item
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  public id!: number;
  public Brand!: string;
  public Model!: string;
  public AccelSec!: number;
  public TopSpeed_KmH!: number;
  public Range_Km!: number;
  public Efficiency_WhKm!: number;
  public FastCharge_KmH!: number;
  public RapidCharge!: string;
  public PowerTrain!: string;
  public PlugType!: string;
  public BodyStyle!: string;
  public Segment!: string;
  public Seats!: number;
  public PriceEuro!: number;
  public Date!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    Brand: { type: DataTypes.STRING, allowNull: false },
    Model: { type: DataTypes.STRING, allowNull: false },
    AccelSec: { type: DataTypes.FLOAT, allowNull: false },
    TopSpeed_KmH: { type: DataTypes.FLOAT, allowNull: false },
    Range_Km: { type: DataTypes.FLOAT, allowNull: false },
    Efficiency_WhKm: { type: DataTypes.FLOAT, allowNull: false },
    FastCharge_KmH: { type: DataTypes.FLOAT, allowNull: false },
    RapidCharge: { type: DataTypes.STRING, allowNull: false },
    PowerTrain: { type: DataTypes.STRING, allowNull: false },
    PlugType: { type: DataTypes.STRING, allowNull: false },
    BodyStyle: { type: DataTypes.STRING, allowNull: false },
    Segment: { type: DataTypes.STRING, allowNull: false },
    Seats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    PriceEuro: { type: DataTypes.FLOAT, allowNull: false },
    Date: { type: DataTypes.DATEONLY, allowNull: false },
  },
  {
    tableName: "items",
    sequelize: db,
    timestamps: false,
  }
);

export default Item;
