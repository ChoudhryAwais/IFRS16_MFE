import { formatCurrency } from "../../helper/FormateValues";
import { TableLoadingSpinner } from "../LoadingBar/LoadingBar";

export default function CustomCard({ card, loading }) {
    return (
        <div className="flex-1 m-1 bg-white shadow-md rounded-md p-5 text-center border border-gray-200">
            <h5 className="text-sm font-semibold text-gray-700">{card.title}</h5>
            <p className="text-xs font-semibold text-gray-400">{card.subTitle}</p>
            <p className={`text-md font-bold mt-2 ${card.color}`}>
                {
                    loading ? <TableLoadingSpinner /> : (typeof (card.value) === "number") ? (formatCurrency(parseInt(card.value))) : card.value
                }

            </p>
        </div>
    );
}