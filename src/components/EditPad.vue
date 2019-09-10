<template>
  <b-container fluid>
    <b-row>
      <b-col md="6">
        <b-form-group horizontal label="Filter">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group horizontal label="Per page">
          <b-form-select type="number" :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-table show-empty
            stacked="md"
            :items="items"
            :fields="fields"
            :filter="filter"
            :current-page="currentPage"
            :per-page="perPage"
            @filtered="Filtered"
            ref="editTable">
      <template v-slot:cell(name)="row">
        <b-form-input :disabled="row.item.id!==''" type="text" v-model="row.item.name" size="sm"/>
      </template>
      <template v-slot:cell(type)="row">
        <div @dblclick="ChangeType(row)" class="editType">
          <b-form-input v-if="row.item.customizeType"  v-model="row.item.type" size="sm"/>
          <b-form-select v-else v-model="row.item.type" :options="types" size="sm"/>
        </div>
      </template>
      <template v-slot:cell(source)="row">
        <b-form-input type="number" v-model="row.item.source" size="sm"/>
      </template>
      <template v-slot:cell(status)="row">
        <b-form-select v-model="row.item.status" :options="status" size="sm"/>
      </template>
      <template v-slot:cell(id)="row">
        <div v-if="row.value">
          <b-button size="sm" @click.stop="Save(row)" class="mr-1" variant="primary">
            Save
          </b-button>
          <b-button size="sm" @click.stop="Delete(row)" class="mr-1" variant="danger" :disabled="!owner">
            Delete
          </b-button>
        </div>
        <div v-else>
          <b-button size="sm" @click.stop="Add(row)" class="mr-1" variant="success">
            Add Challenge
          </b-button>
        </div>
      </template>
    </b-table>
    <b-row>
      <b-col class="text-center">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" align="center" />
      </b-col>
    </b-row>

  </b-container>
</template>
<script>
export default {
  name: 'editpad',
  props: {
    items: {
      type: Array,
      default: function () { return [{ id: '', name: '', status: 0, type: '', source: 0 }] }
    },
    types: {
      type: Array,
      default: function () { return [] }
    },
    owner: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filter: '',
      fields: [
        { key: 'name', label: 'Challage Name', sortable: true, sortDirection: 'desc' },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'source', label: 'Source', sortable: true },
        { key: 'status', label: 'Status' },
        { key: 'id', label: 'Actions', 'class': 'text-center' }
      ],
      status: [
        { value: 0, text: 'NO SOLVE ：(' },
        { value: 1, text: 'DONE ：)' }
      ],
      pageOptions: [4, 8, 16, 32],
      currentPage: 1,
      perPage: 8,
      totalRows: this.items.length
    }
  },
  methods: {
    ChangeType: function (row) {
      this.$set(row.item, 'customizeType', !row.item.customizeType)
      this.$refs.editTable.refresh()
    },
    Save: function (row) {
      var checkInput = this._CheckInput(row.item)
      if (checkInput !== true) {
        this.$set(row.item, '_cellVariants', checkInput)
        this.$refs.editTable.refresh()
        return false
      }
      this.$set(row.item, '_cellVariants', '')
      this.$refs.editTable.refresh()
      let data = {
        name: row.item.name,
        source: row.item.source,
        status: row.item.status,
        type: row.item.type
      }
      this.$axios.put(`${this.CONFIG.apiServer}game/${this.$route.params.id}/${row.item.id}`, data).then((result) => {
        // console.log(result.data)
      }).catch((result) => {
        // this.progressing = false
      })
    },
    Delete: function (row) {
      let self = this
      this.$axios.delete(`${this.CONFIG.apiServer}game/${this.$route.params.id}/${row.item.id}`).then((result) => {
        console.log(result.data)
        self.$delete(self.items, row.index)
      }).catch((result) => {
        // this.progressing = false
      })
    },
    Add: function (row) {
      var checkInput = this._CheckInput(row.item)
      let self = this
      if (checkInput !== true) {
        this.$set(row.item, '_cellVariants', checkInput)
        this.$refs.editTable.refresh()
        return false
      }
      this.$set(row.item, '_cellVariants', '')
      this.$refs.editTable.refresh()
      let data = {
        name: row.item.name,
        source: row.item.source,
        status: row.item.status,
        type: row.item.type
      }
      this.$axios.post(`${this.CONFIG.apiServer}game/${this.$route.params.id}`, data).then((result) => {
        row.item.id = result.data.challenge
        self.items.unshift({ id: '', name: '', status: 0, type: '', source: 0 })
        console.log(result.data)
      }).catch((result) => {
        // this.progressing = false
      })
      // console.log(row)
    },
    _CheckInput: function (item) {
      var checkInput = {}
      var flag = true
      if (item.name === '') {
        checkInput['name'] = 'warning'
        flag = false
      }
      if (item.type === '') {
        checkInput['type'] = 'warning'
        flag = false
      }
      return flag || checkInput
    },
    Filtered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
<style>
#editChallenge input[type=number] {
  width: 75px;
}
#editChallenge .editType {
  width: 100px;
}
</style>
