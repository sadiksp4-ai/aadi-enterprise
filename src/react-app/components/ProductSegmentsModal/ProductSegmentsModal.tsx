import React from "react";
import { createPortal } from "react-dom";
import "./ProductSegmentsModal.css";
import data from "../../../../aadi-info.json";

interface ProductSegmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductSegmentsModal: React.FC<ProductSegmentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { productSegmentsOverview } = data;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="modal-title">{productSegmentsOverview.title}</h2>
        <p className="modal-subtitle">{productSegmentsOverview.subtitle}</p>

        <div className="comparison-table">
          <div className="table-header">
            <div className="header-cell empty"></div>
            <div className="header-cell premium">Premium Range</div>
            <div className="header-cell essential">Essential Range</div>
          </div>
          {productSegmentsOverview.comparisonTable.map((row, index) => (
            <div key={index} className="table-row">
              <div className="table-cell feature">{row.feature}</div>
              <div className="table-cell premium">{row.premium}</div>
              <div className="table-cell essential">{row.essential}</div>
            </div>
          ))}
        </div>

        <button className="modal-cta" onClick={onClose}>
          Explore Our Products
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ProductSegmentsModal;

