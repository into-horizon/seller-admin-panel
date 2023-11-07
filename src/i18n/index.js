import productLocalization from "./products/";
import colorLocalization from "./colors";

const setSources = async (i18n) => {
  i18n.addResourceBundle("en", "product", productLocalization.en);
  i18n.addResourceBundle("ar", "product", productLocalization.ar);
  i18n.addResourceBundle("en", "color", colorLocalization.en);
  i18n.addResourceBundle("ar", "color", colorLocalization.ar);
};

export default setSources;
