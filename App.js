import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

const createEmptyGrid = () => Array(9).fill().map(() => Array(9).fill(''));

const App = () => {
  const [grid, setGrid] = useState(createEmptyGrid());

  const handleInputChange = (text, row, col) => {
    const newGrid = grid.map((gridRow, rIdx) =>
      gridRow.map((cell, cIdx) => (rIdx === row && cIdx === col ? text : cell))
    );
    setGrid(newGrid);
  };

  const validateGrid = () => {
    for (let i = 0; i < 9; i++) {
      const row = new Set();
      const col = new Set();
      const box = new Set();
      for (let j = 0; j < 9; j++) {
        const _row = grid[i][j];
        const _col = grid[j][i];
        const _box = grid[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)];

        if (_row !== '' && row.has(_row)) return false;
        if (_col !== '' && col.has(_col)) return false;
        if (_box !== '' && box.has(_box)) return false;

        row.add(_row);
        col.add(_col);
        box.add(_box);
      }
    }
    return true;
  };

  const solveSudoku = () => {
    const solve = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === '') {
            for (let num = 1; num <= 9; num++) {
              if (isValid(grid, row, col, num.toString())) {
                grid[row][col] = num.toString();
                if (solve(grid)) {
                  return true;
                } else {
                  grid[row][col] = '';
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const isValid = (grid, row, col, num) => {
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
          return false;
        }
      }
      return true;
    };

    const newGrid = grid.map(row => [...row]);
    if (solve(newGrid)) {
      setGrid(newGrid);
    } else {
      Alert.alert('No solution exists');
    }
  };

  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TextInput
              key={colIndex}
              style={styles.cell}
              keyboardType="numeric"
              maxLength={1}
              value={cell}
              onChangeText={(text) => handleInputChange(text, rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Validate" onPress={() => {
          if (validateGrid()) {
            Alert.alert('The grid is valid');
          } else {
            Alert.alert('The grid is invalid');
          }
        }} />
        <Button title="Solve" onPress={() => {
          if (validateGrid()) {
            solveSudoku();
          } else {
            Alert.alert('The grid is invalid');
          }
        }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    textAlign: 'center',
    margin: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default App;
