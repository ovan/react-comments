class CommentsController < ApplicationController

  def index
    respond_to do |format|
      format.html { render :template => "comments/index" }
      format.json {
        render :json => Comment.all.map { |comment|
          comment.attributes.select { |k, v| ['id', 'author', 'text'].include?(k) }
        }
      }
    end
  end

end
