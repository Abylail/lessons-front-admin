<template>
  <div class="base-photo-input">

    <div class="base-photo-input__list" :class="{disabled: isLoading}">
      <div class="base-photo-input__item" :style="{height: imageSize, width: imageSize}" v-for="(imageUrl, index) in selfValue" :key="index">
        <img class="base-photo-input__image" :src="getImageUrl(imageUrl)"/>
        <div class="base-photo-input__edit" v-if="!multiple" @click.stop="triggerInput()"><v-icon>mdi-pencil</v-icon></div>
        <div class="base-photo-input__remove" v-else @click.stop="removeHandle(imageUrl)"><v-icon>mdi-close</v-icon></div>
      </div>
      <div class="base-photo-input__add" :style="{height: imageSize, width: imageSize}" v-if="showPlus" @click.stop="triggerInput()">
        <v-icon color="primary">mdi-plus</v-icon>
      </div>
    </div>

    <input ref="input" type="file" accept="image/*" v-show="false" @change="inputHandle($event?.target?.files[0])"/>
  </div>
</template>

<script>
import {fileToBase64} from "@/helpers/file";

export default {
  name: "BasePhotoInput",
  props: {
    value: {
      type: [String, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default",
      validator: val => ["default", "small"].includes(val)
    }
  },
  data: () => ({
    selfLoading: false,
  }),
  computed: {
    selfValue() {
      if (!this.multiple && this.value) return [this.value];
      return this.value || [];
    },

    isLoading() {
      return this.loading || this.selfLoading;
    },

    showPlus() {
      if (this.multiple) return true;
      return !this.value;
    },

    imageSize() {
      if (this.size === "small") return "50px";
      return "120px"
    }
  },
  methods: {
    async inputHandle(file) {
      if (!file) return;
      this.selfLoading = true;
      const base64File = await fileToBase64(file);
      if (!base64File) {
        this.selfLoading = false;
        return this.$toast.error("Поврежденный файл");
      }
      this.selfLoading = false;
      this.$emit("upload", base64File);
    },

    getImageUrl(url) {
      return process.env.CDN_URL + url;
    },

    // Вызвать инпут
    triggerInput() {
      this.$refs.input.click();
    },

    // Удалить
    removeHandle(imageUrl) {
      this.$emit("remove", imageUrl);
    },
  }
}
</script>

<style lang="scss" scoped>
.base-photo-input {

  &__list {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  &__edit {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.7);
    border-top-left-radius: 5px;
    cursor: pointer;
    transition: .15s;

    &:hover {
      background-color: white;
    }
  }

  &__remove {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.7);
    border-bottom-left-radius: 5px;
    cursor: pointer;
    transition: .15s;

    &:hover {
      background-color: white;
    }
  }

  &__image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 2px solid #1976d2;
    border-radius: 5px;
    cursor: pointer;
    transition: .15s;

    &:hover {
      background-color: rgba(25, 118, 210, 0.4);
    }
  }

}
</style>
