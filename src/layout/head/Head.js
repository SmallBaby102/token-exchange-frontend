import React from 'react';

import { Helmet } from 'react-helmet';

const Head = ({ ...props }) => {
  return (
    <Helmet>
      <title>{ props.title ? `Cryptowire ${props.title}` : 'Cryptowire' }</title>
    </Helmet>
  );
};
export default Head;
