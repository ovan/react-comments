/** @jsx React.DOM */
// The above declaration must remain intact at the top of the script.

var data = [
    {author: "Olli Vanhapiha", text: "Rails Conventions move the world forward."},
    {author: "Jordan Walke", text: "This is yet *another* sarcastic comment."}
];

function getCommentsFromServer(success) {
    $.get("/comments", success, "json");
}

function postNewCommentToServer(author, text) {
    $.post("/comments", {author: author, text: text}, null, "json");
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
        return(<div className="commentList">No comments.</div>);
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
	var that = this;
	getCommentsFromServer(function (comments) { that.setState({data: comments}) });
    },
    handleCommentSubmit: function(comment) {
        postNewCommentToServer(comment.author, comment.text);
    },
    getInitialState: function() {
        return {data: this.props.comments || []};
    },
    componentDidMount: function () {
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
