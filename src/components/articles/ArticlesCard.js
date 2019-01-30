import React, { Component } from "react";
// import { Link } from "react-router-dom";

export default class ArticleCard extends Component {
    render() {
        return (
            // create container for each individual article with title, corresponding delete button and article synopsis
            <div key={this.props.article.id} className="card">
                <div className="card-body">
                    <h5 className="card-title">
                        {this.props.article.title}
                    </h5>

                    <p>{this.props.article.url}<br />{this.props.article.synopsis}</p>
                    <button className={`article--${this.props.article.id}`} onClick={() => this.props.deleteArticle(this.props.article.id)}>Delete</button>
                </div>
            </div>
        )
    }
}