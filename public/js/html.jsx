import React from 'react';
import { Code, Icon } from 'watson-react-components';

export default React.createClass({
    propTypes: {
        url: React.PropTypes.string
    },

    getInitialState: function() {
        return {content: ''};
    },

    componentDidMount() {
        this.fetchContent(this.props.url);
    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.url !== this.props.url) {
            this.setState({content: ''});
            this.fetchContent(nextProps.url);
        }
    },

    fetchContent(url) {
        fetch(url)
            .then(response => response.text() ) // todo: check response.ok and throw if not ok (?)
            .then(content => this.setState({content}))
            .catch(err => this.setState({content: err.message || err.toString()}));
    },

    render() {
        if (this.state.content) {
            return (
                <pre className="code--pre language-markup">
                   <Code type="html">{this.state.content}</Code>
                </pre>
            );
        } else {
            return (<Icon type="loader" />)
        }

    }

});
