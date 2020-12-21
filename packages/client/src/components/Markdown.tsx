import React from "react";
import ReactMarkdown from "react-markdown";

class Code extends React.PureComponent {
    constructor(props: any) {
        super(props);
        this.setRef = this.setRef.bind(this);
    }

    setRef(el: any) {
        // @ts-ignore
        this.codeEl = el;
    }

    componentDidMount() {
        this.highlightCode();
    }

    componentDidUpdate() {
        this.highlightCode();
    }

    highlightCode() {
        // @ts-ignore
        window.hljs.highlightBlock(this.codeEl);
    }

    render() {
        return (
            <pre>
                {/* @ts-ignore */}
                <code ref={this.setRef}>{this.props.value}</code>
            </pre>
        );
    }
}

export function Render(props: { markdown: string }) {
    return (
        <ReactMarkdown
            className="markdown-component"
            source={props.markdown}
            renderers={{ code: Code }}
        />
    );
}
