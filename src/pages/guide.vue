<template>
    <div class="nkg__container">
        <section class="nkg__section">
            <h3>背景色</h3>
            <div class="row px-3">
                <div class="bg-light col-6 col-md-2 p-3">bg-light</div>
                <div class="bg-lightgray col-6 col-md-2 p-3">bg-lightgray</div>
                <div class="bg-gray col-6 col-md-2 p-3">bg-gray</div>
                <div class="bg-darkgray col-6 col-md-2 p-3">bg-darkgray</div>
                <div class="bg-dark col-6 col-md-2 p-3">bg-dark</div>
                <div class="bg-primary col-6 col-md-2 p-3">bg-primary</div>
            </div>
        </section>
        <section class="nkg__section">
            <h3>字級</h3>
            <h1>font-size: 48-42-36</h1>
            <h2>font-size: 28-24-24</h2>
            <h3>font-size: 24</h3>
            <h4>font-size: 20</h4>
            <h5>font-size: 18</h5>
            <h6>font-size: 16</h6>
            <p class="small mb-2">font-size: 14</p>
            <p class="smallest mb-2">font-size: 12</p>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Default checkbox
                </label>
            </div>
            <button type="button" class="btn btn-outline-primary rounded-pill">
                Primary
            </button>
            <a href="" class="d-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start">
                開新視窗<svg-icon name="new-window" size="24" />
            </a>
            <a href="" class="d-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start">
                下載<svg-icon class="ms-2" name="download" size="24" />
            </a>
        </section>
        <section class="nkg__section bg-lightgray">
            <h3>Icons</h3>
            <svg-icon name="arrow-r" size="24"/>
            <svg-icon name="arrow-l" size="24"/>
            <svg-icon name="arrow-up" size="24"/>
            <svg-icon name="arrow-down" size="24"/>
            <svg-icon name="global" size="24"/>
            <svg-icon name="minus" size="24"/>
            <svg-icon name="plus" size="24"/>
            <svg-icon name="contact-us" size="24"/>
            <svg-icon name="csr" size="24"/>
            <svg-icon name="investors" size="24"/>
            <svg-icon name="download" size="24"/>

            <ul class="list-unstyled list-inline">
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg mask"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg plug"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg print"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg wifi"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg chip"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg power"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg tool"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg watch"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg ai"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg beauty"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg print"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg ig"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg fb"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg linkin"></span>
                </li>
                <li class="list-inline-item">
                    <span class="nkg__ic nkg__ic--lg share"></span>
                </li>
            </ul>
        </section>
        <section class="nkg__section bg-primary">
            <h3>Buttons</h3>
            <a href="" class="d-inline-flex justify-content-between align-items-center btn btn-outline-light rounded-pill text-start">
                開新視窗<svg-icon name="new-window" size="24" />
            </a>
            <a href="" class="d-inline-flex justify-content-between align-items-center btn btn-outline-primary rounded-pill text-start">
                下載<svg-icon class="ms-2" name="download" size="24" />
            </a>
            <span class="quarter d-inline-block text-center">Q1</span>            
        </section>
    </div>
</template>


<script>
export default {
    data() {
        return {
            showSelect:false,
            selectDate:'',
        }
    },
}
</script>