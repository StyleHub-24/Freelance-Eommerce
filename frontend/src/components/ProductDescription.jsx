import React from 'react';

const ProductDescription = ({ productId, productDescription }) => {


  const description = productDescription;

  return (
    <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
      {description ? (
        <p>{description}</p>
      ) : (
        <p>Loading product description...</p>
      )}
    </div>
  );
};

export default ProductDescription;
