class CommentsController < ApplicationController

  def list
    render :json => Comment.all.map { |comment|
      comment.attributes.select { |k, v| ['id', 'author', 'text'].include?(k) }
    }
  end
end
