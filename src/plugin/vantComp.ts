import {
  Button,
  Form,
  Field,
  Image as VanImage,
  Checkbox,
  CheckboxGroup,
  Popup,
  Icon,
  NavBar,
} from "vant";
const components = [Button, Form, Field, VanImage, Checkbox, CheckboxGroup, Popup, Icon, NavBar];

export default {
  install(app) {
    components.forEach((comp) => {
      app.use(comp);
    });
  },
};
