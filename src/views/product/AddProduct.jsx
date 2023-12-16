import React, { useState, useEffect, useRef } from "react";
import Multiselect from "multiselect-react-dropdown";
import {
  CFormSelect,
  CFormText,
  CFormCheck,
  CFormInput,
  CButton,
  CFormFloating,
  CFormTextarea,
  CCol,
  CForm,
  CRow,
  CInputGroup,
  CFormLabel,
  CTooltip,
  CAlert,
  CSpinner,
} from "@coreui/react";
import { useSelector, connect, useDispatch } from "react-redux";
import { addProductHandler, resetSuccess } from "src/store/product";
import {
  usePopup,
  DialogType,
  AnimationType,
  ToastPosition,
} from "react-custom-popup";
import { Trans, useTranslation } from "react-i18next";
import ColorSelector from "src/components/ColorSelector";
import Colors from "../../services/colors";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilPlus, cilInfo } from "@coreui/icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { showDialog } from "src/store/dialog";
import { formatLocalizationKey } from "src/services/utils";

const AddProduct = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["product", "color"]);
  const { categories } = useSelector((state) => state.category);
  const { success, loading } = useSelector((state) => state.products);
  const { addProductHandler } = props;
  const sizeInput = useRef();
  let sizeSymbols = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  let sizeNumbers = _.range(30, 51);

  const initialState = {
    values: [],
    secondCategory: { visible: false, data: [] },
    thirdCategory: {
      visible: false,
      selected: false,
      add: false,
      select: true,
      data: [],
    },
    sizes: { visible: false, add: false },
    selectedSizes: [],
    sizesDetails: [],
    discount: { hasDiscount: false, discountRate: 0 },
    colorsAndSizes: {
      colorsOrSizes: false,
      colors: true,
      sizes: false,
      quantityDetails: [],
    },
  };
  const [values, setValues] = useState([]);
  const [commission, setCommission] = useState(null);
  const [secondCategory, setSecondCategory] = useState({
    visible: false,
    data: [],
  });
  const [thirdCategory, setThirdCategory] = useState({
    visible: false,
    selected: false,
    add: false,
    select: false,
    data: [],
  });
  const [sizes, setSizes] = useState({
    visible: false,
    add: false,
    data: [...sizeSymbols],
  });

  const [discount, setDiscount] = useState({
    hasDiscount: false,
    discountRate: 0,
  });

  const [colorsAndSizes, setColorsAndSizes] = useState(
    initialState.colorsAndSizes
  );

  const updateSizeColor = (e) => {
    let newOne = colorsAndSizes.quantityDetails.map((val) => {
      if (val.id === Number(e.target.id)) {
        return { ...val, color: e.target.value };
      } else return val;
    });
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne });
  };
  const updateSizeQuantity = (e) => {
    let newOne = colorsAndSizes.quantityDetails.map((val) => {
      if (val.id === Number(e.target.id)) {
        return { ...val, quantity: e.target.valueAsNumber };
      } else return val;
    });
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne });
  };

  const updateColorQuantity = (e) => {
    let newOne = colorsAndSizes.quantityDetails.map((val) => {
      if (val.color === e.target.id) {
        return { ...val, quantity: e.target.valueAsNumber };
      } else return val;
    });
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newOne });
  };
  const select = (e) => {
    let arr = colorsAndSizes.quantityDetails.map((x) => x.size);
    let x = e.filter((value) => !arr.includes(value.name));
    let y = x.map((x, i) => ({
      id: colorsAndSizes.quantityDetails.length + 1,
      idx: colorsAndSizes.quantityDetails.length,
      size: x.name,
      color: colorsAndSizes.colors ? "White" : null,
      quantity: 0,
    }));
    setColorsAndSizes((e) => {
      return {
        ...colorsAndSizes,
        quantityDetails: [...colorsAndSizes.quantityDetails, ...y],
      };
    });
  };
  const selectColors = (e) => {
    let arr = colorsAndSizes.quantityDetails.map((x) => x.color);
    let x = e.filter((value) => !arr.includes(value.name));
    let y = x.map((x, i, array) => ({
      id: colorsAndSizes.quantityDetails.length + 1,
      size: null,
      color: x.name,
      quantity: 0,
    }));
    setColorsAndSizes({
      ...colorsAndSizes,
      quantityDetails: [...colorsAndSizes.quantityDetails, ...y],
    });
  };
  const removeColors = (e) => {
    let y = colorsAndSizes.quantityDetails.filter((val) =>
      e.find((v) => v.name === val.color)
    );
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: y });
  };
  const remove = (e) => {
    let y = colorsAndSizes.quantityDetails.filter(
      (val) => !!e.filter((v) => v.name === val.size)[0]
    );
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: y });
  };
  const addSizeColor = (size, idx) => {
    let newColor = {
      id: colorsAndSizes.quantityDetails.length + 1,
      idx: idx + 1,
      size: size,
      color: "White",
      quantity: 0,
    };
    let arr = [...colorsAndSizes.quantityDetails];
    arr.splice(newColor.idx, 0, newColor);
    let final = arr.map((val, i) => {
      return { ...val, idx: i };
    });
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: final });
  };
  const deleteSizeColor = (id) => {
    let newArr = colorsAndSizes.quantityDetails.filter((val) => val.id !== id);
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: newArr });
  };

  const textAlign = {
    ar: "text-align-right",
    en: "text-align-left",
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let obj = {
      entitle: e.target.entitle.value,
      artitle: e.target.artitle.value,
      metatitle: e.target.metatitle.value,
      sku: e.target.sku.value,
      price: e.target.price.value,
      brand_name: e.target.brandName.value,
      quantity:
        colorsAndSizes.quantityDetails.reduce(
          (p, c) => p + Number(c.quantity),
          0
        ) || e.target.quantity.value,
      endescription: e.target.endescription.value,
      ardescription: e.target.ardescription.value,
      parent_category_id: e.target.parentCategory.value,
      child_category_id: e.target.childCategory.value,
      grandchild_category_id:
        e.target.grandChildCategory?.value === "default"
          ? null
          : e.target.grandChildCategory?.value || null,
      size_and_color:
        colorsAndSizes.quantityDetails.length > 0
          ? JSON.stringify(colorsAndSizes.quantityDetails)
          : null,
      discount: discount.hasDiscount,
      discount_rate: discount.discountRate,
      is_commission_included: e.target.isCommissionIncluded.checked,
      commission
    };
    let formData = new FormData();
    if (e.target.image.files.length > 5) {
      dispatch(
        showDialog({
          title: t("imageLimit"),
          type: DialogType.WARNING,
          message: (
            <p className={textAlign[i18n.language]}>{t("imageLimitText")}</p>
          ),
        })
      );
      return;
    }
    if (!e.target.image.files || e.target.image.files.length === 0) {
      dispatch(
        showDialog({
          title: t("imageLimit"),
          type: DialogType.WARNING,
          message: (
            <p className={textAlign[i18n.language]}>
              you need to upload at least one image
            </p>
          ),
        })
      );
      return;
    }
    if (
      _.isEmpty(obj.parent_category_id) ||
      _.isEmpty(obj.child_category_id) ||
      (_.isEmpty(obj.grandchild_category_id) && thirdCategory.selected)
    ) {
      dispatch(
        showDialog({
          title: t("categoryTitle"),
          type: DialogType.WARNING,
          message: t("categoryText"),
        })
      );
      return;
    }
    for (let i = 0; i < e.target.image.files.length; i++) {
      formData.append(
        "image",
        e.target.image.files[i],
        e.target.image.files[i].name
      );
    }
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "number" || typeof value === "boolean") {
        formData.append(key, value);
        return;
      } else if (_.isEmpty(value)) {
        return;
      } else {
        formData.append(key, value);
      }
    });
    addProductHandler(formData);
  };

  const addSizes = (e) => {
    setValues((i) => [...e.target.value.split(",")]);
    if (e.target.value.includes(",")) {
    }
  };
  const handleParentCategoryChange = (e) => {
    const children = categories.find(
      (category) => category.id === e.target.value
    )?.children;
    setSecondCategory({ visible: children?.length > 0, data: children ?? [] });
  };
  const handleChildCategoryChange = (e) => {
    const { data } = secondCategory;
    const selectedCategory = data.find(
      (category) => category.id === e.target.value
    );
    setCommission(selectedCategory?.commission);
    setThirdCategory({
      visible: selectedCategory?.children?.length > 0,
      data: selectedCategory?.children ?? [],
    });
  };

  const resetSizes = () => {
    setColorsAndSizes({ ...colorsAndSizes, quantityDetails: [] });
  };
  useEffect(() => {
    if (success) {
      navigate("/");
      dispatch(resetSuccess());
    }
  }, [success]);

  return (
    <>
      <h2>{t("add_product")}</h2>

      <CForm id="productForm" className="productForm" onSubmit={submitHandler}>
        <CRow
          className="row justify-content-md-center my-3"
          xs={{ gutterY: 3 }}
        >
          <CCol xs={12} xxl={3} lg={4} md={6}>
            <CCol>
              <CFormInput
                id="entitle"
                required
                floatingLabel={t("englishTitle")}
                placeholder={t("englishTitle")}
              />
            </CCol>
          </CCol>
          <CCol xs={12} xxl={3} lg={4} md={6}>
            <CCol>
              <CFormInput
                id="artitle"
                required
                floatingLabel={t("arabicTitle")}
                placeholder={t("arabicTitle")}
              />
            </CCol>
          </CCol>
          <CCol xs={12} xxl={3} lg={4} md={6}>
            <CCol>
              <CFormInput
                id="metatitle"
                floatingLabel={t("metaTitle")}
                placeholder={t("metaTitle")}
              />
            </CCol>
          </CCol>
          <CCol xs={12} xxl={3} lg={4} md={6}>
            <CCol>
              <CFormInput id="sku" floatingLabel="SKU" placeholder="SKU" />
            </CCol>
          </CCol>
          <CCol xs={12} xxl={3} lg={4} md={6}>
            <CCol>
              <CFormInput
                type="number"
                className={`no${i18n.language}`}
                id="price"
                step="0.01"
                required
                floatingLabel={`${t("price")}*`}
                placeholder={`${t("price")}*`}
              />
            </CCol>
          </CCol>
          <CCol xs={12} xxl={3} lg={4} md={6}>
            <CCol>
              <CFormInput
                type="text"
                id="brandName"
                placeholder={t("brandName")}
                floatingLabel={t("brandName")}
              />
            </CCol>
          </CCol>
          {!colorsAndSizes.colorsOrSizes && (
            <CCol xs={12} xxl={3} lg={4} md={6}>
              <CFormInput
                type="number"
                id="quantity"
                className={`no${i18n.language}`}
                floatingLabel={t("quantity")}
                placeholder={t("quantity")}
                required={!colorsAndSizes.colorsOrSizes}
              />
              <CFormText>{t("quantityLabel")}</CFormText>
            </CCol>
          )}
        </CRow>

        <CRow className="justify-content-center my-3">
          <CCol xs={12} md={6}>
            <CFormFloating>
              <CFormTextarea
                placeholder="Leave a comment here"
                id="endescription"
                style={{ height: "100px" }}
              ></CFormTextarea>
              <CFormLabel required>{t("englishDescrition")}*</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol xs={12} md={6}>
            <CFormFloating>
              <CFormTextarea
                placeholder="Leave a comment here"
                id="ardescription"
                style={{ height: "100px" }}
              ></CFormTextarea>
              <CFormLabel required>{t("arabicDescription")}*</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>
        <CRow xs={{ gutterY: 3 }}>
          <CCol xs={{ span: 12, offset: 0 }}>
            <CFormSelect
              required
              onChange={handleParentCategoryChange}
              id="parentCategory"
            >
              <option value="">{t("parentCategory")}</option>
              {categories?.map((val, idx) => (
                <option value={val.id} key={`parent_Category_${idx}`}>
                  {val[`${i18n.language}title`]}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={{ span: 12, offset: 0 }}>
            <CFormSelect
              disabled={!secondCategory.visible}
              onChange={handleChildCategoryChange}
              id="childCategory"
            >
              <option value="">{t("childCategory")}</option>

              {secondCategory.data.map((val, idx) => (
                <option value={val.id} key={`child_Category_${idx}`}>
                  {val[`${i18n.language}title`]}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={{ span: 12, offset: 0 }}>
            {thirdCategory.visible && (
              <CFormCheck
                label={t("selectThird")}
                onChange={(e) =>
                  setThirdCategory({
                    ...thirdCategory,
                    select: e.target.checked,
                  })
                }
                checked={thirdCategory.select}
              />
            )}
            {thirdCategory.select && (
              <CFormSelect
                id="grandChildCategory"
                disabled={!thirdCategory.visible}
                className="mt-3"
              >
                <option value="">{t("grandChildCategory")}</option>

                {thirdCategory.data.map((val, idx) => (
                  <option value={val.id} key={`grand_child_Category_${idx}`}>
                    {val[`${i18n.language}title`]}
                  </option>
                ))}
              </CFormSelect>
            )}
          </CCol>
          <CCol xs={{ span: 12, offset: 0 }}>
            <CFormCheck
              id="size"
              label={t("COLOR_OR_SIZE")}
              onChange={(e) =>
                setColorsAndSizes({
                  ...colorsAndSizes,
                  colorsOrSizes: e.target.checked,
                })
              }
              checked={colorsAndSizes.colorsOrSizes}
            />
          </CCol>
          {colorsAndSizes.colorsOrSizes && (
            <CCol xs={{ span: 12, offset: 0 }} className="px-4">
              <CFormCheck
                type="radio"
                name="sc"
                id="TC1"
                label={t("COLORS")}
                onChange={(e) =>
                  setColorsAndSizes({
                    ...colorsAndSizes,
                    colors: e.target.checked,
                    sizes: !e.target.checked,
                    quantityDetails: [],
                  })
                }
                checked={colorsAndSizes.colors && !colorsAndSizes.sizes}
              />
              <CFormCheck
                type="radio"
                name="sc"
                id="TC1"
                label={t("SIZES")}
                onChange={(e) =>
                  setColorsAndSizes({
                    ...colorsAndSizes,
                    colors: !e.target.checked,
                    sizes: e.target.checked,
                    quantityDetails: [],
                  })
                }
                checked={!colorsAndSizes.colors && colorsAndSizes.sizes}
              />
              <CFormCheck
                type="radio"
                name="sc"
                id="TC1"
                label={t(formatLocalizationKey("colors and sizes"))}
                onChange={(e) =>
                  setColorsAndSizes({
                    ...colorsAndSizes,
                    colors: e.target.checked,
                    sizes: e.target.checked,
                    quantityDetails: [],
                  })
                }
                checked={colorsAndSizes.colors && colorsAndSizes.sizes}
              />
              <CRow>
                {colorsAndSizes.colors && !colorsAndSizes.sizes && (
                  <CCol xs={{ span: 4, offset: 0 }}>
                    <Multiselect
                      options={Colors.map((val, idx) => ({
                        name: t(val, { ns: "color" }),
                        id: idx + 1,
                      }))}
                      onSelect={selectColors}
                      onRemove={removeColors}
                      selectedValues={(e) => console.log(e)}
                      displayValue="name"
                      placeholder={t("select")}
                    />
                  </CCol>
                )}
                {colorsAndSizes.sizes && (
                  <CCol className="my-3 px-5">
                    {" "}
                    <CFormCheck
                      type="radio"
                      name="s"
                      id="TC1"
                      label={t("symbolSizes")}
                      onChange={() => {
                        setSizes({
                          ...sizes,
                          data: [...sizeSymbols],
                          add: false,
                        });
                        resetSizes();
                      }}
                      checked={typeof sizes.data[0] === "string"}
                    />
                    <CFormCheck
                      type="radio"
                      name="s"
                      id="TC2"
                      label={t("numericSizes")}
                      onChange={() => {
                        setSizes({
                          ...sizes,
                          data: [...sizeNumbers],
                          add: false,
                        });
                        resetSizes();
                      }}
                      checked={typeof sizes.data[0] === "number"}
                    />
                    <CFormCheck
                      type="radio"
                      name="s"
                      id="TC2"
                      label={t("addOther")}
                      onChange={() => {
                        setSizes({ ...sizes, add: true });
                        resetSizes();
                      }}
                      checked={sizes.add}
                    />
                    {sizes.add ? (
                      <CCol>
                        <CInputGroup className="w-25 my-3">
                          <CFormInput
                            type="text"
                            ref={sizeInput}
                            // id="sizesInput"
                            placeholder={t("inserSizes")}
                            required
                            onChange={addSizes}
                          />
                          <CButton
                            color="secondary"
                            type="button"
                            onClick={() => {
                              select(
                                values.map((val, idx) => ({
                                  name: val,
                                  id: idx++,
                                }))
                              );
                              sizeInput.current.value = "";
                            }}
                          >
                            {t("add")}
                          </CButton>
                        </CInputGroup>
                      </CCol>
                    ) : (
                      <CCol xs={12} md={6} lg={4} xxl={3} className="m-3">
                        <Multiselect
                          options={sizes.data.map((val, idx) => ({
                            name: val,
                            id: idx + 1,
                          }))}
                          onSelect={select}
                          onRemove={remove}
                          selectedValues={(e) => console.log(e)}
                          displayValue="name"
                          placeholder={t("select")}
                          className="w-100"
                        />
                      </CCol>
                    )}
                  </CCol>
                )}
                {colorsAndSizes.colorsOrSizes && (
                  <CCol xs={12}>
                    {colorsAndSizes.quantityDetails.length > 0 && (
                      <div
                        className="p-2 border-1 rounded border-dark bg-white my-2"
                        style={{
                          overflowY: "scroll",
                          maxHeight: "15rem",
                          width: "30rem",
                          maxWidth: "100%",
                        }}
                      >
                        {colorsAndSizes.sizes &&
                          colorsAndSizes.quantityDetails.map((val, idx) => (
                            <CRow
                              key={`size${idx}`}
                              className="p-2 align-items-center justify-content-center"
                            >
                              <CCol xs={1} className="p-0">
                                <h5 className="m-0">{val.size}: </h5>
                              </CCol>
                              <CCol xs={4}>
                                {colorsAndSizes.colors && (
                                  <ColorSelector
                                    key={val["id"]}
                                    id={val["id"]}
                                    onChange={updateSizeColor}
                                    value={val.color}
                                    className={"w-100"}
                                  />
                                )}
                              </CCol>
                              <CCol xs={4}>
                                <CFormInput
                                  type="number"
                                  id={val["id"]}
                                  key={`sizeQty${val["id"]}`}
                                  placeholder={t("quantity")}
                                  onChange={updateSizeQuantity}
                                  className={`no${i18n.language}`}
                                  min={0}
                                />
                              </CCol>
                              {colorsAndSizes.sizes && colorsAndSizes.colors && (
                                <CCol xs="auto">
                                  <CTooltip content="add another color">
                                    <CButton color="info" size="sm">
                                      <CIcon
                                        icon={cilPlus}
                                        onClick={() =>
                                          addSizeColor(val.size, val.idx)
                                        }
                                      />
                                    </CButton>
                                  </CTooltip>
                                  <CTooltip content="remove color">
                                    <CButton color="danger" size="sm">
                                      <CIcon
                                        icon={cilTrash}
                                        onClick={() => deleteSizeColor(val.id)}
                                      />
                                    </CButton>
                                  </CTooltip>
                                </CCol>
                              )}
                            </CRow>
                          ))}

                        {colorsAndSizes.colors &&
                          !colorsAndSizes.sizes &&
                          colorsAndSizes.quantityDetails.map((val, idx) => (
                            <div
                              key={`color${idx}`}
                              className="marginDiv sizesDiv"
                            >
                              <h5 className="sizeHead">{val.color}: </h5>
                              <CFormInput
                                type="number"
                                id={val.color}
                                key={`sizeQty${idx}`}
                                placeholder={t("quantity")}
                                onChange={updateColorQuantity}
                                className={`no${i18n.language}`}
                                step={1}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </CCol>
                )}
              </CRow>
            </CCol>
          )}
          <CCol>
            <CFormCheck
              id="discount"
              label={t("hasDiscount")}
              onChange={(e) =>
                setDiscount({ ...discount, hasDiscount: e.target.checked })
              }
              checked={discount.hasDiscount}
              className="mb-3"
            />
            {discount.hasDiscount && (
              <>
                <CFormInput
                  type="number"
                  placeholder={t("insertDiscount")}
                  className="w-25"
                  step="0.01"
                  max="0.99"
                  onChange={(e) =>
                    setDiscount({
                      ...discount,
                      discountRate: e.target.valueAsNumber,
                    })
                  }
                />
                <CFormText>{t("discountLabel")}</CFormText>
              </>
            )}
          </CCol>
          <CCol xs={12}>
            <CFormCheck
              label={t("COMMISSION_INCLUDED")}
              id="isCommissionIncluded"
            />
          </CCol>
          {commission && (
            <CAlert color="primary" className="d-flex align-items-center">
              <CIcon
                icon={cilInfo}
                className="flex-shrink-0 me-2"
                width={24}
                height={24}
              />
              <div>
                <Trans
                  defaults={t("COMMISSION_TEXT")}
                  values={{
                    commission: commission * 100,
                    included: t("COMMISSION_INCLUDED"),
                  }}
                />
              </div>
            </CAlert>
          )}
          <hr />
          <CCol>
            <CFormInput
              type="file"
              id="image"
              multiple="multiple"
              onChange={(e) => console.log(e.target.files[0])}
              accept="image/png,image/jpeg"
            />
            <CFormText>{t("uploadLabel")}</CFormText>
          </CCol>
          <CCol xs={12}>
            <CFormText>- * {t("required")}</CFormText>
          </CCol>
          <CCol>
            <CButton type="submit" color="primary" disabled={loading}>
              {loading ? (
                <CSpinner size="sm" color="light" variant="grow" />
              ) : (
                t("submit")
              )}
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { addProductHandler };
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
