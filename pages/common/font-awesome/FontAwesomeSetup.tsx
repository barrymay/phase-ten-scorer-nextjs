import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/pro-regular-svg-icons';

library.add(far);
const FontAwesomeSetup = () => {
  return (
    <style type="text/css">{`
      ${dom.css()}
    `}</style>
  );
};
export default FontAwesomeSetup;
