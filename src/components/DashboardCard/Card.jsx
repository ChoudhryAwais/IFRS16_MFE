import { formatCurrency } from "../../helper/FormateValues";
import { TableLoadingSpinner } from "../LoadingBar/LoadingBar";

export default function CustomCard({ card, loading }) {
    const today = new Date().toISOString().split('T')[0];
    return (
        <div className="flex-1 bg-white shadow-md rounded-md p-5 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
            <p className="text-xs font-semibold text-gray-400">{card.subTitle}</p>
            <p className={`text-xl font-bold mt-2 ${card.color}`}>
                {
                    loading ? <TableLoadingSpinner /> : formatCurrency(card.value)
                }

            </p>
        </div>
    );
}