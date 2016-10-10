import React from 'react';

export default function Word(props) {
    const src = `https://docs.google.com/gview?url=${location.protocol}//${location.host}${props.url}&embedded=true`;
    return (<iframe className="input-embed" src={src}></iframe>);
}


Word.propTypes = {
    url: React.PropTypes.string
};
