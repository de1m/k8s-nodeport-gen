<template>
  <div class="serv-con">
    <div class="uk-container uk-container-center uk-container-expand">
      <div class="uk-grid uk-align-center">
        <div class="uk-width-1-1">
          <h1 class="uk-heading-line uk-text-center"><span>Kubernetes Services</span></h1>
        </div>
      </div>
      <div class="uk-grid uk-align-center">
        <div class="uk-margin">
          <h5 style="margin-bottom:0">Random nodeport: </h5>
          <div class="uk-placeholder uk-text-center" style="margin-top:0;" v-bind:data="newPort">
            <h1> {{ newPort }} </h1>
          </div>
          <div class="uk-width-1-1 uk-text-center">
            <vk-button size="large" type="primary" v-clipboard:copy="newPort" v-on:click="copyNodePort">
              <vk-icon icon="copy"></vk-icon> Copy
            </vk-button>
            <vk-button size="large" type="primary" v-clipboard:copy="newPort" v-on:click="reservePort(newPort)">
              copy and reserve
            </vk-button>
            <vk-button size="large" v-on:click="refreshSite">
              <vk-icon icon="refresh"></vk-icon> refresh
            </vk-button>
            <!-- <p> {{ srvInfo }} </p> -->
          </div>
        </div>
      </div>
      <div v-if="showSuccessText" class="uk-alert-success" uk-alert>
          <p> {{succsesText}}</p>
      </div>
      <div class="uk-grid uk-align-center">
        <!-- v-for="value in controllers" v-bind:key="value.id" -->
        <!-- <p> {{srvInfo}} </p> -->
        <table class="uk-table uk-table-hover uk-table-divider">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Service Port Name</th>
              <th>Service Node Port</th>
              <th>Service Target Port</th>
              <th>Service Protocol</th>
            </tr>
          </thead>
            <tbody>
              <tr v-for="value in srvInfo" v-bind:key="value.id">
                <td>{{ value.svcname }}</td>
                <td>{{ value.svcportname }}</td>
                <td>{{ value.nodePort }}</td>
                <td>{{ value.svcportint }}</td>
                <td>{{ value.svctype }}</td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data () {
    return {
      srvInfo: null,
      newPort: null,
      succsesText: null,
      showSuccessText: false
    }
  },
  methods: {
    reservePort: function (port) {
      axios
        .post('/reserve', {
          port: this.newPort
        })
        .then(response => {
          this.getRandom()
          this.succsesText = 'Kubernetes Node Port ' + port + ' was successfull reserved'
          this.showSuccessText = true
        })
    },
    refreshSite: function () {
      // location.reload()
      this.getRandom()
    },
    getRandom: function () {
      axios
        .get('/ports')
        .then(response => {
          this.srvInfo = response.data.srvInfo
          this.newPort = response.data.newPort
        })
    },
    copyNodePort: function () {
      this.succsesText = 'Kubernetes Node Port ' + this.newPort + ' was successfull copied'
      this.showSuccessText = true
    }
  },
  beforeMount () {
    this.getRandom()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
