<template>
  <div class="grid" :key="hash">
    <div v-for="row of rows" :key="row" class="row">
      <div 
        v-for="cell of cols" 
        :key="cell" 
        class="cell"
        :class="[gameType]"
        :area-num="grid[row-1][cell-1]"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';

export default {
  name: 'Layout2048',

  props: {
    rows: Number,
    cols: Number,
    width: String,
    height: String,
    gameType: String,
  },

  data: () => ({
    lodash: _,
    grid: {},
    emptyGrid: {},
    hash: null,
    usedCells: {},
  }),

  watch: {
    hash() {
      Vue.set(this, 'emptyGrid', {});
      _.times(this.rows, rowIndex => {

        _.times(this.cols, columnIndex => {
          if(this.grid[rowIndex][columnIndex]) return;
          const row = _.get(this.emptyGrid, rowIndex, {});
          Vue.set(row, columnIndex, null);
          Vue.set(this.emptyGrid, rowIndex, row);
        });

      });
    },
    score(score) {
      if(!score) return;
      this.$emit('updateScore', score);
    },
  },

  computed: {
    score() {
      return _.chain(this.grid)
        .flatMapDeep(row => _.values(row))
        .sum()
        .value();
    },
  },

  methods: {
    startGame() {
      Vue.set(this, 'grid', {});
      _.times(this.rows, rowIndex => {
        _.times(this.cols, columnIndex => {
          const row = _.get(this.grid, rowIndex, {});
          Vue.set(row, columnIndex, null);
          Vue.set(this.grid, rowIndex, row);
        });
      });
      this.hash = JSON.stringify(this.grid);
    },

    endGame() {
      this.$emit('gameover');
      this.startGame();
    },

    getRandomCell(mount = 2) {
      this.$nextTick(() => {
        _.times(mount, num => {
          if(!_.size(this.emptyGrid)) return this.endGame();
  
          const rowIndex = _.sample(_.keys(this.emptyGrid));
          const row = this.emptyGrid[rowIndex];
          const cellIndex = _.sample(_.keys(row));

          Vue.set(this.grid[rowIndex], cellIndex, _.sample([2, 4]));
          this.hash = JSON.stringify(this.grid);
          this.checkEndGame();
        })
      })
    },


    move(vector) {
      this.shiftDefined({
        left: { isHorizontal: true },
        right: { isHorizontal: true, isReverseX: true },
        up: { isVertical: true },
        down: { isVertical: true, isReverseY: true },
      }[vector]);
    },

    shiftDefined({ isReverseX, isReverseY, isVertical, isHorizontal }) {
      let rowIndexs = _.times(_.size(this.grid));
      let colIndexs = _.times(_.size(this.grid[0]));
      if(isReverseX) colIndexs = colIndexs.reverse();
      if(isReverseY) rowIndexs = rowIndexs.reverse();

      _.each(rowIndexs, (fromRow, rowIndex) => {
        if(!rowIndex && isVertical) return;

        for(let colIndex = 0; colIndex < colIndexs.length; colIndex++) {
          const fromCol = colIndexs[colIndex];
          const value = this.grid[fromRow][fromCol];

          if(!colIndex && isHorizontal) continue;
          if(!value) continue;

          let newCol, newRow;

          if(isVertical) {
            newCol = fromCol;
            const newRows = _.cloneDeep(rowIndexs).reverse().slice(!isReverseY ? -fromRow-1 : fromRow);
            newRow = _.find(newRows, (newRow, index) => {
              const valueOfIndex = this.grid[newRow][fromCol];
              const valueOfNextIndex = this.grid?.[newRows[index+1]]?.[fromCol];
              if(!valueOfNextIndex && index !== newRows.length-1) return false;
              if(this.usedCells?.[newRows[index+1]]?.[fromCol]) return true;
              if(!valueOfIndex && index === newRows.length-1) return true;
              if(valueOfNextIndex !== value) return true;
              if(valueOfIndex == value && index) return true;
            });
          }

          if(isHorizontal) {
            newRow = fromRow;
            const newCols = _.cloneDeep(colIndexs).reverse().slice(!isReverseX ? -fromCol-1 : fromCol);
            newCol = _.find(newCols, (newCol, index) => {
              const valueOfIndex = this.grid[fromRow][newCol];
              const valueOfNextIndex = this.grid[fromRow][newCols[index+1]];
              if(!valueOfNextIndex && index !== newCols.length-1) return false;
              if(this.usedCells?.[fromRow]?.[newCols[index+1]]) return true;
              if(!valueOfIndex && index === newCols.length-1) return true;
              if(valueOfNextIndex !== value) return true;
              if(valueOfIndex == value && index) return true;
            });
          }


          const nextValue = this.grid[newRow][newCol];

          Vue.set(this.grid[fromRow], fromCol, null);
          
          const newValue = nextValue == value && (newRow !== fromRow || newCol !== fromCol) ? nextValue * 2 : value;
          Vue.set(this.grid?.[newRow], newCol, newValue);

          if(newCol == fromCol || !nextValue) continue;
          Vue.set(this.usedCells, newRow, this.usedCells[newRow] || {});
          Vue.set(this.usedCells[newRow], newCol, true);
          
        }
      })

      const oldHash = _.clone(this.hash);
      this.hash = JSON.stringify(this.grid);
      Vue.set(this, 'usedCells', {});
      if(oldHash === this.hash) return this.checkEndGame();
      this.getRandomCell();
    },

    async checkEndGame() {
      if(_.size(this.emptyGrid)) return;

      const isEndGame = await new Promise(resolve => {
        _.each(this.grid, (row, rowIndex) => {
          _.each(row, (cell, cellIndex) => {
            if(cell == row[cellIndex + 1]) resolve(false);
            if(cell == this.grid?.[+rowIndex + 1]?.[+cellIndex]) resolve(false);
            if(rowIndex == _.size(this.grid) - 1 && cellIndex == _.size(row) - 1) resolve(true);
          });
        });
      });
      if(isEndGame) this.endGame();
    },
  },

  beforeMount() {
    this.startGame();
    this.getRandomCell();
  },
};
</script>

<style lang="scss" scoped>

.grid {
  display: grid;
  gap: 10px;
  grid-auto-rows: 1fr;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .row {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 10px;
    .cell {
      color: var(--text-color);
      display: flex;
      background: var(--main-bg-color);
      border-radius: 10px;
      justify-content: center;
      align-items: center;
      overflow: hidden;

      $sizes: (
        "2": 1,
        "4": 2,
        "8": 3,
        "16": 4,
        "32": 5,
        "64": 6,
        "128": 7,
        "256": 8,
        "512": 9,
        "1024": 10,
        "2048": 11,
      );

      &[area-num]::after {
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: cell .1s linear 1 forwards;
        background-color: var(--special-color);
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
      }

      &.raindrops {
        @each $size, $index in $sizes {
          &[area-num="#{$size}"]::after { 
            content: "";
            width: #{$index}0%;
            height: #{$index}0%;
            opacity: calc(#{$index} / 10);
            font-size: calc(#{$index}0% * 3);
          }
        }
      }

      &.square[area-num]::after {
        content: attr(area-num);
        background-color: transparent;
      }

    }
  }
}

@keyframes cell {
  from {
    transform: scale(.9);
  }
}
</style>