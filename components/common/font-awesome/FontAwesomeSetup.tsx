import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
const FontAwesomeSetup = () => {
  return (
    <style type="text/css">{`
      ${dom.css()}
    `}</style>
  );
};
export default FontAwesomeSetup;
