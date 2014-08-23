/** @jsx React.DOM */
// The above declaration must remain intact at tht top of the script.
// Your code here

var data = [
    {author: "Olli Vanhapiha", text: "Rails Conventions move the world forward."},
    {author: "Jordan Walke", text: "This is yet *another* sarcastic comment."}
];

function getCommentsFromServer() {
    return data;
}

function postNewCommentToServer(author, text) {
    data.push({author: author, text: text});
    return data;
}

var converter = new Showdown.converter();
var Comment = React.createClass({
    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
		<div className="comment">
		<h2 className="commentAuthor">
                {this.props.author}
            </h2>
		<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
		</div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
            return (
		    <Comment author={comment.author}>{comment.text}</Comment>
            );
        });

        if (commentNodes.length > 0) {
            return(<div className="commentList">{commentNodes}</div>);
        }
        return(<div className="commentList">No comments so far.</div>);
    }
});

var CommentForm = React.createClass({
    handleSubmit: function () {
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        console.log("handleSubmit - author: " + author + ", text: " + text);
        if (!text || !author) {
            return false;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        return false;
    },
    render: function() {
        return (
		<form className="commentForm" onSubmit={this.handleSubmit}>
		  <input type="text" placeholder="Your name" ref="author" />
	      	  <input type="textarea" placeholder="Say something..." ref="text" />
		  <input type="submit" value="Post" />
		</form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function () {
        this.setState({data: getCommentsFromServer()});
    },
    handleCommentSubmit: function(comment) {
        this.setState({data: postNewCommentToServer(comment.author, comment.text)});
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
		<div className="commentBox">
		<h1>Comments</h1>
		<CommentList data={this.state.data} />
		<CommentForm onCommentSubmit={this.handleCommentSubmit} />
		</div>
        );
    }
});
