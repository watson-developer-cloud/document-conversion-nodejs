import React from 'react';
import { Code } from 'watson-react-components';

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
            output: ''
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
            .then(output => this.setOutput(id, format, output));
    },

    setOutput(id, format, output) {
        if (id != this.props.id || format != this.props.format) {
            // this could happen if the user rapidly switches formats
            // eslint-disable-next-line no-console
            console.warn('input or format changed while fetching output. Discarding output', id, format);
            return;
        }
        if (format === 'json') {
            try {
                output = JSON.stringify(JSON.parse(output), null, 2);
            } catch (ex) {
                // eslint-disable-next-line no-console
                console.log('failed to parse output as json', id, format, ex, output);
            }
        }
        this.setState({output});
    },

    render() {

        if (!this.props.id || !this.props.format) {
            return (<div/>)
        }

        return (
            <div>
                <Code type={this.props.format}>{this.state.output}</Code>
                <a title="Download output file" href={`/api/convert?document_id=${this.props.id}&conversion_target=${formats[this.props.format]}&download=true`}
                   className="base--a">Download</a>
            </div>
        );
    }

});

