import productLocalization from "./products/";
import colorLocalization from "./colors";
import globalsLocalization from "./globals";
import profileLocalization from "./profile";
import dashboardLocalization from "./dashboard";
import routesLocalization from "./routes";
import registerLocalization from "./register";
import loginLocalization from "./login";
import settingsLocalization from "./settings";
import financeLocalization from "./finance";
import orderLocalization from "./order";
import statusesLocalization from "./statuses";

const localizations = [
  { ns: "product", source: productLocalization },
  { ns: "color", source: colorLocalization },
  { ns: "global", source: globalsLocalization },
  { ns: "profile", source: profileLocalization },
  { ns: "dashboard", source: dashboardLocalization },
  { ns: "route", source: routesLocalization },
  { ns: "register", source: registerLocalization },
  { ns: "login", source: loginLocalization },
  { ns: "settings", source: settingsLocalization },
  { ns: "finance", source: financeLocalization },
  { ns: "order", source: orderLocalization },
  { ns: "status", source: statusesLocalization },
];

const ar = "ar";
const en = "en";

const setSources = async (i18n) => {
  localizations.forEach(({ ns, source }) => {
    i18n.addResourceBundle(en, ns, source[en]);
    i18n.addResourceBundle(ar, ns, source[ar]);
  });
};

export default setSources;
