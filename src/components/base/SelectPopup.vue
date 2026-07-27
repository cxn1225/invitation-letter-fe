<script lang="ts" setup>
  import type { PropType } from "vue";

  interface propsIf {
    id: string | number;
    name: string;
  }
  const props = defineProps({
    list: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "请选择",
    },
    options: {
      type: Object as PropType<propsIf>,
      default() {
        return {
          id: "id",
          name: "name",
        };
      },
    },
    active: {
      type: [Number, String],
      default: "",
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    styleType: {
      type: String,
      default: "colTwo",
    },
  });
  const emit = defineEmits(["update:show", "change"]);
  const multipleVal = ref<string[]>([]);
  const visiable = computed({
    get() {
      return props.show;
    },
    set(newVal) {
      emit("update:show", newVal);
    },
  });
  function initData() {
    if (props.isMultiple) {
      if (props.active !== -1 && props.active) {
        multipleVal.value = String(props.active).split(",");
      }
    }
  }
  function closeHandle() {
    multipleVal.value = [];
  }
  function change(item: any) {
    if (!props.isMultiple) {
      visiable.value = false;
      emit("change", { id: item[props.options.id], name: item[props.options.name] });
    } else {
      let fIndex = multipleVal.value.findIndex((fItem) => fItem == item[props.options.id]);
      if (fIndex > -1) {
        multipleVal.value.splice(fIndex, 1);
      } else {
        multipleVal.value.push(String(item[props.options.id]));
      }
    }
  }
  function sureHandle() {
    const nameList = multipleVal.value.map((id) => {
      return props.list.find((lItem) => lItem[props.options.id] == id)[props.options.name];
    });
    emit("change", { id: multipleVal.value.join(","), name: nameList.join("+") });
    visiable.value = false;
  }
</script>
<template>
  <van-popup
    v-model:show="visiable"
    class="select-popup"
    position="bottom"
    teleport="body"
    round
    @open="initData"
    @closed="closeHandle"
  >
    <van-nav-bar class="nav-bar-popup" :title="title">
      <template #left>
        <van-icon class="van-icon-36" name="cross" color="#677685" @click="visiable = false" />
      </template>
    </van-nav-bar>
    <div class="select-con" :class="{ 'col-one': styleType === 'colOne' }">
      <div
        v-for="item in list"
        :key="item[options.id]"
        class="select-item"
        :class="{
          'select-item-active': isMultiple
            ? multipleVal.includes(String(item[options.id]))
            : active == item[options.id],
        }"
        @click="change(item)"
      >
        <span>{{ item[options.name] }}</span>
        <van-icon class="active-check" name="success" />
      </div>
      <van-button v-if="isMultiple" class="btn-large" color="#006AF5" @click="sureHandle"
        >确定</van-button
      >
    </div>
  </van-popup>
</template>

<style lang="less" scoped>
  .select-con {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 56px 44px 56px;
    .hxe-safe-bottom(44px);
    max-height: 80vh;
    overflow-y: scroll;
    .select-item {
      flex-basis: calc(50% - 13px);
      .common-ellipsis(calc(50% - 12px));
      background-color: @background-color-grey;
      height: 80px;
      line-height: 80px;
      border-radius: 40px;
      text-align: center;
      margin-top: 24px;
      font-size: 28px;
      border: 1px solid @background-color-grey;
      box-sizing: border-box;
      padding: 0 10px;
      &:nth-child(odd) {
        margin-right: 24px;
      }
      .active-check {
        display: none;
      }
    }
    .select-item-active {
      background: #fffaf9;
      border-color: #ff6047;
      color: #ff6047;
      font-weight: bold;
    }
    .btn-large {
      height: 88px !important;
      margin-top: 32px;
    }
  }
  &.col-one {
    .select-item {
      flex-basis: 100%;
      max-width: 100%;
      margin-right: 0 !important;
      text-align: left;
      padding: 0 40px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .select-item-active {
      .active-check {
        display: block;
      }
    }
  }
</style>
