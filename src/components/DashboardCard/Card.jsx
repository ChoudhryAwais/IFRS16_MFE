import { formatCurrency } from "../../helper/FormateValues";
import { TableLoadingSpinner } from "../LoadingBar/LoadingBar";

export default function CustomCard({ card, loading }) {
    console.log("Card Data: ", typeof (card.value) );
    return (
        <div className="flex-1 m-1 bg-white shadow-md rounded-md p-4 text-center border border-gray-200 dark:bg-gray-800">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-100">{card.title}</h5>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-200">{card.subTitle}</p>
            <p className={`text-xs font-bold mt-2 ${card.color}`}>
                {
                    loading ? <TableLoadingSpinner /> : 
                    (typeof (card.value) === "number") ? (formatCurrency(parseInt(card.value))) : card.value
                }

            </p>
        </div>
    );
}