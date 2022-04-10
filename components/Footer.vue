<template>
  <footer class="mastfoot mb-3 bg-white py-4 border-top">
    <div class="inner container">
      <div class="row">
        <div class="col-md-12">
          <nav class="nav nav-mastfoot justify-content-center">
            <a class="nav-link" href="https://twitter.com/adelriosantiago">
              <i class="fab fa-2x fa-twitter"></i><br />
              <small>Rant</small>
            </a>
            <a class="nav-link" href="https://www.instagram.com/a.delrio.santiago/">
              <i class="fab fa-2x fa-instagram"></i><br />
              <small>Pics</small>
            </a>
            <a class="nav-link" href="http://stackoverflow.com/users/1996066/adelriosantiago">
              <i class="fab fa-2x fa-stack-overflow"></i><br />
              <small>Copy/Paste</small>
            </a>
            <a class="nav-link" href="https://github.com/adelriosantiago">
              <i class="fab fa-2x fa-github"></i><br />
              <small>Code</small>
            </a>
            <a class="nav-link" href="https://pinterest.com/adelriosantiago/">
              <i class="fab fa-2x fa-pinterest-p"></i><br />
              <small>Ideas</small>
            </a>
            <a class="nav-link" @click="openModal('snapchat')">
              <i class="fab fa-2x fa-snapchat-ghost"></i><br />
              <small>???</small>
            </a>
            <a class="nav-link" @click="openModal('skype')">
              <i class="fab fa-2x fa-skype"></i><br />
              <small>Talk</small>
            </a>
            <a class="nav-link" href="https://www.openstreetmap.org/user/adelriosantiago">
              <i class="fas fa-2x fa-map-marked-alt"></i><br />
              <small>Mapping</small>
            </a>
            <a class="nav-link" href="https://www.tradingview.com/u/adelriosantiago">
              <i class="fas fa-2x fa-comment-dollar"></i><br />
              <small>Finance</small>
            </a>
            <a class="nav-link" @click="openModal('bitcoin')">
              <i class="fab fa-2x fa-bitcoin"></i><br />
              <small>Mining</small>
            </a>
            <a class="nav-link" @click="openModal('whatsapp')">
              <i class="fab fa-2x fa-whatsapp"></i><br />
              <small>Chat</small>
            </a>
            <a class="nav-link" @click="openModal('telegram')">
              <i class="fab fa-2x fa-telegram-plane"></i><br />
              <small>Text</small>
            </a>
            <a class="nav-link" @click="openModal('phone')">
              <i class="fas fa-2x fa-phone-square"></i><br />
              <small>Call</small>
            </a>
            <a class="nav-link" @click="openModal('mail')">
              <i class="far fa-2x fa-envelope"></i><br />
              <small>Mail</small>
            </a>
            <a class="nav-link" @click="S.showBlog = !S.showBlog">
              <i class="fas fa-2x fa-book"></i><br />
              <small>Blog</small>
              <i class="fas fa-arrow-up" v-show="S.showBlog"></i>
              <i class="fas fa-arrow-down" v-show="!S.showBlog"></i>
            </a>
          </nav>
        </div>
        <div v-if="false" class="col-md-12 d-flex align-items-center justify-content-center">
          <p class="mb-0">&copy; {{ new Date().getUTCFullYear() }} Alejandro del Río Santiago</p>
        </div>

        <!-- Modals -->
        <div id="mod-snapchat" style="display: none">
          <img src="/images/snap.jpeg" />
        </div>

        <div id="mod-skype" style="display: none">
          <h5 class="text-center">Skype ID: adelriosantiago</h5>
        </div>

        <div id="mod-bitcoin" style="display: none">
          <h5 class="text-center">Bitcoin address:</h5>
          <img src="images/bitcoin-address.jpg" style="display: block; margin: auto" />
          <h5 class="text-center">1Nbhqpi2CWu8a6WPyVajUxoXRNyN53dEzX</h5>
        </div>

        <div id="mod-whatsapp" style="display: none">
          <h5 class="text-center">
            <span class="flag-icon flag-icon-mx"></span> Whatsapp: <em>+52</em>&nbsp;&nbsp;&nbsp;33 1471 5215<br /><br />
            <small><p>Whatsapp calls and text only.</p></small>
          </h5>
        </div>

        <div id="mod-telegram" style="display: none">
          <h5 class="text-center">
            <span class="flag-icon flag-icon-ch"></span> Telegram: <em class="mr-5">+41</em>&nbsp;&nbsp;&nbsp;79 456 81
            46 (@adelriosantiago) <br /><br />
            <small><p>Telegram only.</p></small>
          </h5>
        </div>

        <div id="mod-phone" style="display: none">
          <h5 class="text-center">
            <span class="flag-icon flag-icon-us"></span> Phone: <em>+1</em>&nbsp;&nbsp;&nbsp;484 862 9092
          </h5>
        </div>

        <div id="mod-mail" style="display: none">
          <h5 class="text-center">Address:<br /><br />adelriosantiago@gmail.com</h5>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
let modal

export default {
  data: () => {
    return {}
  },
  computed: {},
  created() {},
  mounted() {
    modal = new tingle.modal()
  },
  methods: {
    openModal(type) {
      modal.setContent(document.getElementById(`mod-${type}`).innerHTML)
      modal.open()
    },
  },
}
</script>

<style></style>
