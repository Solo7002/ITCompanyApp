import "./Feedbacks.css";

const Feedbacks=()=>{
    return(
        <div class="container my-5">
            <h1 class="text-center mb-4">Feedbacks</h1>
            <ul class="nav nav-tabs" id="reviewsTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="user-reviews-tab" data-bs-toggle="tab"      data-bs-target="#user-reviews" type="button" role="tab" aria-controls="user-reviews"        aria-selected="true">My feedbacks</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="recent-reviews-tab" data-bs-toggle="tab"       data-bs-target="#recent-reviews" type="button" role="tab" aria-controls="recent-reviews"    aria-selected="false">Feedbacks left by me</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="search-reviews-tab" data-bs-toggle="tab"       data-bs-target="#search-reviews" type="button" role="tab" aria-controls="search-reviews"    aria-selected="false">Employees feedbacks</button>
                </li>
            </ul>
            <div class="tab-content" id="reviewsTabContent">
                { /*Reviews about the current user*/ }
                <div class="tab-pane fade show active" id="user-reviews" role="tabpanel"        aria-labelledby="user-reviews-tab">
                    <div class="list-group mt-3">
                        { /*Example Review Item*/ }
                        <div class="list-group-item">
                            <h5>From: <b><i>Solod Ihor</i></b></h5>
                            <div class="star-rating">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                            <p class="mt-2">review text</p>
                            <div class="review-date">2024-05-19</div>
                        </div>
                        { /*More reviews can be added here*/ }
                    </div>
                </div>
                { /*Feedbacks left by me*/ }
                <div class="tab-pane fade" id="recent-reviews" role="tabpanel" aria-labelledby="recent-reviews-tab">
                    <div class="list-group mt-3">
                        { /*Example Review Item*/ }
                        <div class="list-group-item">
                            <h5>For: <b><i>Solod Ihor</i></b></h5>
                            <div class="star-rating">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                            <p class="mt-2">reveiw text</p>
                            <div class="review-date">2024-05-19</div>
                        </div>
                        { /*More reviews can be added here*/ }
                    </div>
                    <div class="mt-4 text-center">
                        <button class="btn btn-primary">Add feedback</button>
                    </div>
                </div>
                { /*Search feedbacks*/ }
                <div class="tab-pane fade" id="search-reviews" role="tabpanel" aria-labelledby="search-reviews-tab">
                    <div class="mt-4">
                        <h4>Seach feedbacks</h4>
                        <form class="mb-4">
                            <div class="mb-3">
                                <label for="search-username" class="form-label">Employee name:</label>
                                <input type="text" class="form-control" id="search-username" placeholder="Enter employee name" />
                            </div>
                            <button type="submit" class="btn btn-primary">seach</button>
                        </form>
                        <div class="list-group">
                            { /*Seach feedback item start*/ }
                            <div class="list-group-item">
                                <h5>From: <b><i>Solod Ihor</i></b></h5>
                                <h5>For: <b><i>Solod Ihor</i></b></h5>
                                <div class="star-rating">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                    <i class="fa-regular fa-star"></i>
                                </div>
                                <p class="mt-2">review text</p>
                                <div class="review-date">2024-05-18</div>
                            </div>
                            { /*Seach feedback item end*/ }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export{Feedbacks};