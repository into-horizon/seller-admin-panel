import React, { useState, useEffect } from "react";
import { useSelector, connect, useDispatch } from "react-redux";
import {
  CButton,
  CSpinner,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalFooter,
  CFormSelect,
} from "@coreui/react";
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
import { cilPlus, cilPencil, cilStorage, cilImagePlus } from "@coreui/icons";
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
  status,
}) => {
  const pageSize = 5;
  let sizeSymbols = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  let sizeNumbers = _.range(30, 51);
  const navigate = useNavigate();
  const {
    message,
    currentProducts: { count, products },
    loading,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const initialState = {
    discount: { visible: "", discount: false, discountRate: 0 },
    sizes: { original: [], updated: [] },
  };
  const { parentCategories, childCategories, grandChildCategories } =
    useSelector((state) => state.category);
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "addProduct",
  });
  const [sizes, setSizes] = useState(initialState.sizes);
  const [sizesType, setSizesType] = useState({
    add: false,
    data: [...sizeSymbols],
  });
  const [values, setValues] = useState([]);
  const [SQLoad, setSQLoad] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState({
    SQBtn: false,
    discountBtn: false,
  });
  const [params, setParams] = useState({
    limit: 5,
    offset: 0,
    status: status,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [sizeForm, setSizeForm] = useState({ visible: "" });
  const [product, setProduct] = useState({ color: false, size: false });
  const [colorAndSize, setColorAndSize] = useState({ color: "", size: "" });
  const { size: productSize, color: productColor } = product;
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
    setSearchParams({...getSearchParamsObject(searchParams), page})
    getProductsByStatusHandler({
      ...getSearchParamsObject(searchParams),
      page,
      pageSize,
      status,
    });
    // setParams((params) => {
    //   const newParams = { ...params, offset: params.limit * (n - 1) };
    //   return newParams;
    // });
  };

  const completeArray = (x) => {
    let arr = [];
    for (let i = 0; i < 5 - x; i++) {
      arr.push({ id: "i" + 1, product_picture: null });
    }
    return arr;
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

  const updateSQ = (id, s) => {
    setSizeForm((x) => {
      return { ...x, visible: id };
    });
    if (s) {
      setSizes({ ...sizes, original: JSON.parse(s), updated: JSON.parse(s) });
      JSON.parse(s)
        .map((val) => val.color)
        .filter((val) => val).length > 0 &&
        setProduct((x) => {
          return { ...x, color: true };
        });
      JSON.parse(s)
        .map((val) => val.size)
        .filter((val) => val).length > 0 &&
        setProduct((x) => {
          return { ...x, size: true };
        });
    }
  };

  const selectColors = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val, i) => {
          return {
            id: sizes.updated.length + i + 1,
            size: null,
            color: val.name,
            quantity: 0,
          };
        }),
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
  };
  const removeColors = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val, i) => {
          return {
            id: sizes.original.length + i,
            size: null,
            color: val.name,
            quantity: 0,
          };
        }),
      ],
    };
    setSizes(x);
  };

  const select = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val) => {
          return { size: val.name, quantity: 0 };
        }),
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
  };
  const remove = (e) => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.original,
        ...e.map((val) => {
          return { size: val.name, quantity: 0 };
        }),
      ],
    };
    setSizes(x);
  };
  const updateQuantity = (e) => {
    // let y = [...sizes.updated]
    let x = sizes.updated.map((val) => {
      if (val.id === Number(e.target.id)) {
        return {
          ...val,
          quantity:
            Number(e.target.value) === 0 ? null : Number(e.target.value),
        };
      } else {
        return val;
      }
    });
    setSizes({ ...sizes, updated: x });
  };
  const addSizes = (e) => {
    setValues((i) => [...e.target.value.split(",")]);
    // if (e.target.value.includes(',')) {
    // }
  };

  const removeSize = (size) => {
    let newSizes = sizes.updated.filter((val) => val.id !== size);
    let newOriginal = sizes.original.filter((val) => val.id !== size);
    setSizes({ ...sizes, original: newOriginal, updated: newSizes });
  };

  const updateSQHandler = (e, id) => {
    setSQLoad(true);
    e.preventDefault();
    updateSizeAndQuantity({
      id: id,
      quantity:
        sizes.updated.reduce((p, c) => p + Number(c.quantity), 0) ||
        e.target.quantityInput.value,
      size_and_color:
        sizes.updated.length > 0 ? JSON.stringify(sizes.updated) : null,
    });
    closeQuantityModal();
  };

  const addOwnSizes = () => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.updated,
        ...values.map((val) => {
          return { size: val, quantity: 0 };
        }),
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
    document.getElementById("sizesInput").value = null;
  };

  useEffect(() => {
    reverseTitles();
    changeBtnAlign();
  }, [i18n.language]);

  useEffect(() => {
    changeBtnAlign();
    reverseTitles();
  }, [document.querySelectorAll(".deleteBtn")]);

  // useEffect(() => {
  //   if (message && message.includes("success")) {
  //     // setLoading(false);
  //   } else if (message && message.includes("updated")) {
  //     setSQLoad(false);
  //     setSizes(initialState.sizes);
  //     setDisabledBtn({ ...disabledBtn, SQBtn: false });
  //   }
  //   dispatch(errorMessage({ message: "" }));
  // }, [message]);

  const downloadableData = (data) => {
    return data?.map((product) => {
      let p = { ...product };
      delete p.pictures;
      delete p.size_and_color;
      return p;
    });
  };
  const closeQuantityModal = () => {
    setSizeForm({ visible: "" });
    setSizes(initialState.sizes);
    setProduct({ color: false, size: false });
  };

  const addSizeAndColor = () => {
    let x = {
      ...sizes,
      updated: [
        ...sizes.updated,
        {
          id: sizes.updated.length + 1,
          color: colorAndSize.color,
          size: colorAndSize.size,
          quantity: 0,
        },
      ],
    };
    x.updated = x.updated.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.size === value.size && t.color === value.color)
    );
    setSizes(x);
  };

  const AddOwnComponent = ({ onClick }) => {
    return (
      <React.Fragment>
        {sizesType.add && (
          <div className="addOwnSizes">
            <CFormLabel htmlFor="validationServer05">{t("sizes")}</CFormLabel>
            <CFormInput
              type="text"
              value={values.join(",")}
              id="sizesInput"
              placeholder={t("inserSizes")}
              required
              onChange={addSizes}
            />
            <CButton color="secondary" type="button" onClick={onClick}>
              {t("add")}
            </CButton>
          </div>
        )}
      </React.Fragment>
    );
  };

  const addNewSizes = () => {
    setSizesType((d) => {
      return { ...d, data: [...d.data, ...values] };
    });
    setValues([]);
  };
  return (
    <div className="productsRender">
      <Export
        data={downloadableData(products ?? [])}
        title="download products"
        fileName="products"
      />
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
            <div className="productPictures">
              {React.Children.toArray(
                product.pictures.length > 0 || status !== "pending" ? (
                  [
                    ...product.pictures,
                    ...completeArray(product.pictures.length),
                  ]?.map((picture, i) => (
                    <div key={picture.id + Math.random()}>
                      {picture.product_picture ? (
                        <>
                          <CButton
                            color="light"
                            className="deleteBtn"
                            onClick={() =>
                              deleteProductPictureHandler({
                                picture_id: picture.id,
                              })
                            }
                            style={{
                              visibility:
                                status === "pending" ? "hidden" : "visible",
                            }}
                          >
                            X
                          </CButton>
                          <img
                            key={`pic${picture.id}`}
                            src={picture.product_picture}
                            alt="vbdf"
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
                    </div>
                  ))
                ) : (
                  <h2>{t("noPictures")}</h2>
                )
              )}
            </div>
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
              {
                parentCategories.filter(
                  (v) => v.id === product.parent_category_id
                )[0][`${i18n.language}title`]
              }
            </h6>
            <h6>
              <strong>{`${t("childCategory")}:`}</strong>{" "}
              {
                childCategories.filter(
                  (v) => v.id === product.child_category_id
                )[0][`${i18n.language}title`]
              }
            </h6>
            {product.grandchild_category_id ? (
              <h6>
                <strong>{`${t("grandChildCategory")}:`}</strong>{" "}
                {
                  grandChildCategories.filter(
                    (v) => v.id === product.grandchild_category_id
                  )[0][`${i18n.language}title`]
                }
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
                  {/* <CButton
                    color="success"
                    className="SQBtn"
                    onClick={() => updateSQ(product.id, product.size_and_color)}
                  >
                    <CIcon icon={cilStorage}></CIcon>
                    {t("quantity")}
                  </CButton>
                  <CModal
                    alignment="center"
                    size={product.size_and_color && "lg"}
                    scrollable={true}
                    visible={product.id === sizeForm.visible}
                    onClose={closeQuantityModal}
                  >
                    <CModalHeader>{t("quantity")}</CModalHeader>
                    <form onSubmit={(e) => updateSQHandler(e, product.id)}>
                      {!product.size_and_color && (
                        <h6 style={{ margin: "2rem 0", textAlign: "center" }}>
                          <strong>{t("quantity")}: </strong>
                          <input
                            className="discounRate"
                            id="quantityInput"
                            type="number"
                            min="1"
                            defaultValue={product.quantity}
                          />
                        </h6>
                      )}
                      <CRow>
                        <CCol md={6}>
                          {productColor && !productSize && (
                            <div className="m-10rem">
                              {" "}
                              <Multiselect
                                options={colors
                                  .filter(
                                    (val) =>
                                      !sizes.updated
                                        .map((v) => v.color)
                                        .includes(val)
                                  )
                                  .map((val, idx) => {
                                    return { name: val, id: idx + 1 };
                                  })}
                                onSelect={selectColors}
                                onRemove={removeColors}
                                selectedValues={(e) => console.log(e)}
                                displayValue="name"
                                placeholder={t("select")}
                              />
                            </div>
                          )}
                          {productSize && !productColor && (
                            <div>
                              <div>
                                <section className="radioBtns">
                                  <section>
                                    <CFormCheck
                                      type="radio"
                                      name="s"
                                      id="TC1"
                                      label={t("symbolSizes")}
                                      defaultChecked
                                      onChange={() =>
                                        setSizesType({
                                          ...sizesType,
                                          data: [...sizeSymbols],
                                          add: false,
                                        })
                                      }
                                    />
                                  </section>

                                  <section>
                                    <CFormCheck
                                      type="radio"
                                      name="s"
                                      id="TC2"
                                      label={t("numericSizes")}
                                      onChange={() =>
                                        setSizesType({
                                          ...sizesType,
                                          data: [...sizeNumbers],
                                          add: false,
                                        })
                                      }
                                    />
                                  </section>
                                  <section>
                                    <CFormCheck
                                      type="radio"
                                      name="s"
                                      id="TC2"
                                      label={t("addOther")}
                                      onChange={() =>
                                        setSizesType({
                                          ...sizesType,
                                          add: true,
                                        })
                                      }
                                    />
                                  </section>
                                </section>
                              </div>
                              <div className="m-10rem">
                                {!sizesType.add && (
                                  <Multiselect
                                    options={sizesType.data.map((val, idx) => {
                                      return { name: val, id: idx + 1 };
                                    })}
                                    onSelect={select}
                                    onRemove={remove}
                                    selectedValues={(e) => console.log(e)}
                                    displayValue="name"
                                    placeholder={t("select")}
                                  />
                                )}

                                <AddOwnComponent onClick={addOwnSizes} />
                              </div>
                            </div>
                          )}
                          {productSize && productColor && (
                            <CRow className="padding">
                              <CCol md={12}>
                                <CFormCheck
                                  type="radio"
                                  name="sc"
                                  label={t("symbolSizes")}
                                  defaultChecked
                                  onChange={() =>
                                    setSizesType({
                                      ...sizesType,
                                      data: [...sizeSymbols],
                                      add: false,
                                    })
                                  }
                                />
                              </CCol>
                              <CCol md={12}>
                                <CFormCheck
                                  type="radio"
                                  name="sc"
                                  label={t("numericSizes")}
                                  onChange={() =>
                                    setSizesType({
                                      ...sizesType,
                                      data: [...sizeNumbers],
                                      add: false,
                                    })
                                  }
                                />
                              </CCol>
                              <CCol md={12}>
                                <CFormCheck
                                  type="radio"
                                  name="sc"
                                  label={t("addOther")}
                                  onChange={() =>
                                    setSizesType({ ...sizesType, add: true })
                                  }
                                />
                              </CCol>
                              <CCol md={4}>
                                <CFormSelect
                                  value={colorAndSize.size}
                                  onChange={(e) =>
                                    setColorAndSize((x) => {
                                      return { ...x, size: e.target.value };
                                    })
                                  }
                                >
                                  <option value="" disabled>
                                    select size
                                  </option>
                                  {sizesType.data.map((val, idx) => (
                                    <option key={idx + val} value={val}>
                                      {val}
                                    </option>
                                  ))}
                                </CFormSelect>
                              </CCol>
                              <CCol md={4}>
                                <ColorSelector
                                  selectstatement="true"
                                  value={colorAndSize.color}
                                  onChange={(e) =>
                                    setColorAndSize((x) => {
                                      return { ...x, color: e.target.value };
                                    })
                                  }
                                />
                              </CCol>
                              <CCol md={4}>
                                <CButton
                                  color="secondary"
                                  onClick={addSizeAndColor}
                                  disabled={
                                    !(colorAndSize.color && colorAndSize.size)
                                  }
                                >
                                  <CIcon icon={cilPlus} size="sm"></CIcon>
                                  {t("add")}
                                </CButton>
                              </CCol>
                              {sizesType.add && (
                                <div className="addOwnSizes">
                                  <CFormLabel htmlFor="validationServer05">
                                    {t("sizes")}
                                  </CFormLabel>
                                  <CFormInput
                                    type="text"
                                    value={values.join(",")}
                                    id="sizesInput"
                                    placeholder={t("inserSizes")}
                                    required
                                    onChange={addSizes}
                                  />
                                  <CButton
                                    color="secondary"
                                    type="button"
                                    onClick={addNewSizes}
                                  >
                                    {t("add")}
                                  </CButton>
                                </div>
                              )}
                            </CRow>
                          )}
                        </CCol>
                        <CCol md={6}>
                          <ul className="productUl">
                            {sizes.updated.length > 0 &&
                              sizes.updated.map((size, i) => (
                                <li key={`${i}${size.size}`} className="m-5rem">
                                  <button
                                    type="button"
                                    onClick={() => removeSize(size.id)}
                                  >
                                    X
                                  </button>
                                  {size.size && size.color && (
                                    <>
                                      <strong className="m-5rem">
                                        {size.size}
                                      </strong>{" "}
                                      -
                                      <strong className="m-5rem">
                                        {size.color}
                                      </strong>
                                    </>
                                  )}
                                  {size.size && !size.color && (
                                    <strong className="m-5rem">
                                      {size.size}
                                    </strong>
                                  )}
                                  {!size.size && size.color && (
                                    <strong className="m-5rem">
                                      {size.color}
                                    </strong>
                                  )}
                                  <input
                                    min="0"
                                    type="number"
                                    id={size.id}
                                    value={size.quantity}
                                    onChange={updateQuantity}
                                  />
                                </li>
                              ))}
                            {}{" "}
                          </ul>
                        </CCol>
                      </CRow>
                      <CModalFooter>
                        {!SQLoad && (
                          <CButton color="primary" type="submit">
                            {t("submit")}
                          </CButton>
                        )}
                        {!SQLoad && (
                          <CButton color="danger" onClick={closeQuantityModal}>
                            {t("cancel")}
                          </CButton>
                        )}
                        {SQLoad && <CSpinner />}
                      </CModalFooter>
                    </form>
                  </CModal> */}
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
    </div>
  );
};

const mapDispatchToProps = {
  getProductsByStatusHandler,
  addProductPictureHandler,
  deleteProductPictureHandler,
  updateSizeAndQuantity,
  updateDiscount,
  deleteProductHandler,
};
export default connect(null, mapDispatchToProps)(ProductsRender);
