import { useState } from "react";
import Products from "../components/Products/Products";
import ProductSegmentsModal from "../components/ProductSegmentsModal/ProductSegmentsModal";

function ProductsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page">
            <Products onOpenModal={() => setIsModalOpen(true)} />
            <ProductSegmentsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default ProductsPage;
