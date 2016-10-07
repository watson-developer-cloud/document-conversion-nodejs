import React from 'react';
import { Code, Icon } from 'watson-react-components';

export const formats = {
    json: 'ANSWER_UNITS',
    html: 'NORMALIZED_HTML',
    text: 'NORMALIZED_TEXT'
};

export default React.createClass({
    propTypes: {
        id: React.PropTypes.string, // id is the filename for this app
        format: React.PropTypes.oneOf(Object.keys(formats)) // destination format after the conversion
    },

    getInitialState: function() {
        return {
            content: ''
        };
    },

    componentDidMount() {
        this.fetchContent(this.props.id, this.props.format);
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.id !== this.props.id || nextProps.format !== this.props.format) {
            this.setState({content: ''});
            this.fetchContent(nextProps.id, nextProps.format);
         }
    },

    fetchContent(id, format) {
        // short-circuit if we don't have enough data
        if (!id || !format ) {
            return;
        }
        fetch(`/api/convert?document_id=${id}&conversion_target=${formats[format]}`)
            .then(res => res.text())
            .then(content => this.setContent(id, format, content));
    },

    setContent(id, format, content) {
        if (id != this.props.id || format != this.props.format) {
            // this could happen if the user rapidly switches formats
            // eslint-disable-next-line no-console
            console.warn('input or format changed while fetching output. Discarding output', id, format);
            return;
        }
        if (format === 'json') {
            try {
                // pretty print JSON output
                content = JSON.stringify(JSON.parse(content), null, 2);
            } catch (ex) {
                // eslint-disable-next-line no-console
                console.log('failed to parse output as json', id, format, ex, content);
            }
        }
        this.setState({content});
    },

    render() {
        if (this.state.content) {
            return (
                <div>
                    <Code type={this.props.format}>{this.state.content}</Code>
                    <a title="Download output file" href={`/api/convert?document_id=${this.props.id}&conversion_target=${formats[this.props.format]}&download=true`}
                       className="base--a">Download</a>
                </div>
            );
        } else {
            return (<Icon type="loader" />);
        }
    }

});

