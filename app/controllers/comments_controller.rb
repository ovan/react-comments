class CommentsController < ApplicationController

  respond_to :json
  def index
    comments = Comment.all.map { |c|
      c.attributes.select { |k, v| ['id', 'author', 'text'].include?(k) }
    }

    respond_to do |format|
      format.html {
        render :template => "comments/index", :locals => {viewData: {
          comments: comments,
          pollInterval: 2000
        } }
      }

      format.json {
        render :json => Comment.all.map { |comment|
          comment.attributes.select { |k, v| ['id', 'author', 'text'].include?(k) }
        }
      }
    end
  end

  def create
    c = Comment.create!(author: params[:author], text: params[:text])
    render :json => c
  end

end
