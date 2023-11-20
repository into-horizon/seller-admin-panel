import React, { useEffect } from "react";
import { useSelector, connect } from "react-redux";
import { CButton, CRow, CCol } from "@coreui/react";
import {
  getProductsByStatusHandler,
  addProductPictureHandler,
  deleteProductPictureHandler,
  deleteProductHandler,
} from "src/store/product";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateSizeAndQuantity, updateDiscount } from "../../store/product";
import Export from "../../components/Export";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilImagePlus } from "@coreui/icons";
import LoadingSpinner from "src/components/LoadingSpinner";
import DeleteModal from "src/components/DeleteModal copy";
import _ from "lodash";
import DiscountModal from "./components/DiscountModal";
import Paginator from "src/components/Paginator";
import QuantityModal from "./components/QuantityModal";
import { getSearchParamsObject } from "src/services/utils";

const ProductsRender = ({
  updateSizeAndQuantity,
  updateDiscount,
  deleteProductHandler,
  getProductsByStatusHandler,
  addProductPictureHandler,
  status,
  deleteProductPictureHandler,
}) => {
  const pageSize = 5;
  const navigate = useNavigate();
  const {
    currentProducts: { count, products },
    loading,
  } = useSelector((state) => state.products);
  const { t, i18n } = useTranslation("product");
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const page = searchParams.get("page");
    if (_.isEmpty(page)) {
      setSearchParams({ page: 1 });
      changePage(1);
    } else {
      changePage(page);
    }
  }, []);

  const changePage = (page) => {
    setSearchParams({ ...getSearchParamsObject(searchParams), page });
    getProductsByStatusHandler({
      ...getSearchParamsObject(searchParams),
      page,
      pageSize,
      status,
    });
  };

  const addProductPicture = (e, id) => {
    let formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("id", id);
    addProductPictureHandler(formData);
  };
  const changeBtnAlign = () => {
    let deleteBtn = document.querySelectorAll(".deleteBtn");
    if (i18n.language === "ar" && deleteBtn.length > 0) {
      let className = deleteBtn[0].className.split(" ").slice(0, 3).join(" ");
      deleteBtn.forEach((button) =>
        button.setAttribute("class", `${className} deleteBtnAr`)
      );
    } else if (i18n.language === "en" && deleteBtn.length > 0) {
      let className = deleteBtn[0].className.split(" ").slice(0, 3).join(" ");
      deleteBtn.forEach((button) =>
        button.setAttribute("class", `${className} deleteBtnEn`)
      );
    }
  };
  const reverseTitles = () => {
    if (
      i18n.language === "ar" &&
      document.querySelectorAll(".productTitles").length > 0
    ) {
      let div = document.querySelectorAll(".productTitles");
      div.forEach((item) => (item.style.flexDirection = "row-reverse"));
    } else if (
      i18n.language === "en" &&
      document.querySelectorAll(".productTitles").length > 0
    ) {
      let div = document.querySelectorAll(".productTitles");
      div.forEach((item) => (item.style.flexDirection = ""));
    }
  };

  useEffect(() => {
    reverseTitles();
    changeBtnAlign();
  }, [i18n.language]);

  useEffect(() => {
    changeBtnAlign();
    reverseTitles();
  }, [document.querySelectorAll(".deleteBtn")]);

  const downloadableData = (data) => {
    return data?.map((product) => {
      let p = { ...product };
      delete p.pictures;
      delete p.size_and_color;
      return p;
    });
  };

  return (
    <CRow className=" justify-content-end " xs={{gutterY: 3}}>
      <CCol xs={'auto'} className=" align-self-end ">
        <Export data={downloadableData(products ?? [])} fileName="products" />
      </CCol>
      {loading && <LoadingSpinner />}
      {!loading && products.length === 0 && (
        <h4 className="productStatusHead">{t(`no${status}`)}</h4>
      )}
      {!loading &&
        products?.map((product, idx) => (
          <div className="productRender" key={product.entitle + idx}>
            <div className="productTitles">
              <h3 className="productTitle">{`${t("englishTitle")}: ${
                product.entitle
              }`}</h3>
              <h3 className="productTitle">{`${t("arabicTitle")}: ${
                product.artitle
              }`}</h3>
            </div>

            <CRow className="justify-content-around align-items-center bg-white py-3 border rounded my-2 border-dark">
              {React.Children.toArray(
                product.pictures?.length > 0 || status !== "pending" ? (
                  [
                    ...product.pictures,
                    ..._.range(0, 5 - product.pictures.length),
                  ]?.map((picture) => (
                    <CCol
                      xs={2}
                      className="position-relative "
                      style={{ width: "min-content-width" }}
                    >
                      {picture?.product_picture ? (
                        <>
                          {status !== "pending" && (
                            <CButton
                              color="light"
                              className="position-absolute top-0 start-0"
                              onClick={() =>
                                deleteProductPictureHandler({
                                  picture_id: picture.id,
                                })
                              }
                            >
                              X
                            </CButton>
                          )}
                          <img
                            src={picture.product_picture}
                            alt={product.entitle}
                            className="w-100"
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="file"
                            id={product.id}
                            hidden
                            onChange={(e) => addProductPicture(e, product.id)}
                            accept="image/png,image/jpeg"
                          />
                          <label
                            htmlFor={product.id}
                            className="uploadLabel"
                            style={{
                              visibility:
                                status === "pending" ? "hidden" : "visible",
                            }}
                          >
                            <CIcon icon={cilImagePlus}></CIcon>
                            {t("choosePhoto")}
                          </label>
                        </>
                      )}
                    </CCol>
                  ))
                ) : (
                  <h2>{t("noPictures")}</h2>
                )
              )}
            </CRow>
            <div className="productTitles">
              <div>
                <h4>{t("englishDescrition")}</h4>
                <p style={{ textAlign: "left" }}>{product.endescription}</p>
              </div>
              <div>
                <h4>{t("arabicDescription")}</h4>
                <p style={{ textAlign: "right" }}>{product.ardescription}</p>
              </div>
            </div>
            {product.metatitle && (
              <h5>
                <strong>{t("metatitle")}: </strong>
                {product.metatitle}
              </h5>
            )}
            {product.sku &&
              ((i18n.language === "en" && (
                <h5>
                  <strong>{t("SKU")}:</strong>
                  {product.sku}
                </h5>
              )) ||
                (i18n.language === "ar" && (
                  <h5>
                    {product.sku}
                    <strong> :{t("SKU")}</strong>
                  </h5>
                )))}
            {!product.size ? (
              <h5>
                <strong>{t("quantity")}: </strong>
                {product.quantity}
              </h5>
            ) : null}
            <h6>
              <strong>{`${t("parentCategory")}: `}</strong>
              {product[`p_${i18n.language}title`]}
            </h6>
            <h6>
              <strong>{`${t("childCategory")}:`}</strong>{" "}
              {product[`c_${i18n.language}title`]}
            </h6>
            {product.grandchild_category_id ? (
              <h6>
                <strong>{`${t("grandChildCategory")}:`}</strong>{" "}
                {product[`g_${i18n.language}title`]}
              </h6>
            ) : null}
            <h6>
              <strong>{`${t("price")}:`}</strong>{" "}
              {product.price + " " + t(`${product.currency}`)}
            </h6>
            {product.brand_name ? (
              <h6>
                <strong>{`${t("brandName")}: `}</strong>
                {product.brand_name}
              </h6>
            ) : null}
            <h6>
              <strong>{t("hasDiscount")}: </strong>
              {product.discount ? t("yes") : t("no")}
            </h6>
            {product.discount ? (
              <h6>
                <strong>{t("discountRate")}: </strong>
                {(product.discount_rate * 100).toFixed(0)}%
              </h6>
            ) : null}
            {product.size_and_color ? (
              <div>
                <h6>
                  <strong>{t("sizes")}:</strong>
                </h6>
                <table className="sizesTable">
                  <thead>
                    <tr>
                      {JSON.parse(product.size_and_color)
                        .map((val) => val.color)
                        .filter((val) => val).length > 0 && <th>Color</th>}
                      {JSON.parse(product.size_and_color)
                        .map((val) => val.size)
                        .filter((val) => val).length > 0 && (
                        <th>{t("size")}</th>
                      )}
                      <th>{t("quantity")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {React.Children.toArray(
                      JSON.parse(product.size_and_color).map((val) => (
                        <tr key={Math.random()}>
                          {val.color && <td>{val.color}</td>}
                          {val.size && <td>{val.size}</td>}
                          <td>{val.quantity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <thead>
                    <tr>
                      <th>{t("totalQuantity")}</th>
                      <th>{product.quantity}</th>
                    </tr>
                  </thead>
                </table>
              </div>
            ) : null}
            {status !== "pending" && (
              <CRow className="justify-content-between">
                <CCol xs="auto">
                  <DiscountModal product={product} onSubmit={updateDiscount} />
                </CCol>
                <CCol xs="auto">
                  <DeleteModal
                    btnText={t("delete")}
                    onConfirm={() => deleteProductHandler(product.id)}
                  />
                </CCol>
                <CCol xs="auto">
                  <QuantityModal
                    product={product}
                    updateSizeAndQuantity={updateSizeAndQuantity}
                  />
                </CCol>
                <CCol xs="auto">
                  <CButton
                    color="primary"
                    onClick={() => {
                      navigate(`/product/updateProduct?id=${product.id}`);
                    }}
                  >
                    <CIcon icon={cilPencil}></CIcon>
                    {t("editProduct")}
                  </CButton>
                </CCol>
              </CRow>
            )}
          </div>
        ))}
      <Paginator
        count={count}
        page={searchParams.get("page")}
        onChangePage={changePage}
        pageSize={pageSize}
      />
    </CRow>
  );
};

const mapDispatchToProps = {
  getProductsByStatusHandler,
  addProductPictureHandler,
  deleteProductPictureHandler,
  updateSizeAndQuantity,
  updateDiscount,
  deleteProductHandler,
  addProductPictureHandler,
};
export default connect(null, mapDispatchToProps)(ProductsRender);
