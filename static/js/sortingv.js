let array = [];
let comparisons = 0;
let swaps = 0;
let delayTime = 50;
let isPaused = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-new-array').addEventListener('click', generateArray);
    document.getElementById('btn-bubble-sort').addEventListener('click', () => startSort(bubbleSort, 'Bubble Sort', 'O(n^2)', 'O(n^2)'));
    document.getElementById('btn-selection-sort').addEventListener('click', () => startSort(selectionSort, 'Selection Sort', 'O(n^2)', 'O(n^2)'));
    document.getElementById('btn-merge-sort').addEventListener('click', () => startSort(mergeSort, 'Merge Sort', 'O(n log n)', 'O(n log n)'));
    document.getElementById('btn-quick-sort').addEventListener('click', () => startSort(quickSort, 'Quick Sort', 'O(n^2)', 'O(n log n)'));
    document.getElementById('btn-insertion-sort').addEventListener('click', () => startSort(insertionSort, 'Insertion Sort', 'O(n^2)', 'O(n^2)'));
    document.getElementById('btn-heap-sort').addEventListener('click', () => startSort(heapSort, 'Heap Sort', 'O(n log n)', 'O(n log n)'));
    document.getElementById('btn-pause').addEventListener('click', pauseSort);
    document.getElementById('btn-resume').addEventListener('click', resumeSort);
    document.getElementById('speedControl').addEventListener('input', function() {
        delayTime = 100 - this.value;
    });

    generateArray();
});

function generateArray() {
    const arrayContainer = document.getElementById('arrayContainer');
    arrayContainer.innerHTML = '';

    array = [];
    for (let i = 0; i < 50; i++) {
        array.push(Math.floor(Math.random() * 300) + 5);
        const bar = document.createElement('div');
        bar.style.height = `${array[i]}px`;
        bar.classList.add('bar');
        arrayContainer.appendChild(bar);
    }
    document.getElementById('bigODisplay').textContent = '';
    document.getElementById('performanceDisplay').textContent = '';
}

function swap(arr, idx1, idx2) {
    const temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
}

function delay() {
    return new Promise(resolve => setTimeout(resolve, delayTime));
}

function updateBars() {
    const arrayBars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        arrayBars[i].style.height = `${array[i]}px`;
    }
}

function displayBigOComplexity(algorithm, worstCase, averageCase) {
    const bigODisplay = document.getElementById('bigODisplay');
    bigODisplay.innerHTML = `
        <p>${algorithm} - Worst Case: ${worstCase}</p>
        <p>${algorithm} - Average Case: ${averageCase}</p>
    `;
}

function displayPerformanceMetrics(comparisons, swaps, timeTaken) {
    const performanceDisplay = document.getElementById('performanceDisplay');
    performanceDisplay.innerHTML = `
        <p>Comparisons: ${comparisons}</p>
        <p>Swaps: ${swaps}</p>
        <p>Time Taken: ${timeTaken} milliseconds</p>
    `;
}

function pauseSort() {
    isPaused = true;
}

function resumeSort() {
    isPaused = false;
}

async function startSort(sortFunction, algorithm, worstCase, averageCase) {
    displayBigOComplexity(algorithm, worstCase, averageCase);
    await sortFunction();
}

async function bubbleSort() {
    comparisons = 0;
    swaps = 0;
    const startTime = performance.now();

    for (let i = 0; i < array.length; i++) {
        let swapped = false;
        for (let j = 0; j < array.length - i - 1; j++) {
            comparisons++;
            if (array[j] > array[j + 1]) {
                swap(array, j, j + 1);
                swaps++;
                swapped = true;
                await delay();
                while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
                updateBars();
            }
        }
        if (!swapped) break;
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    displayPerformanceMetrics(comparisons, swaps, timeTaken);
}

async function selectionSort() {
    comparisons = 0;
    swaps = 0;
    const startTime = performance.now();

    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            comparisons++;
            if (array[j] < array[min]) {
                min = j;
            }
        }
        if (i !== min) {
            swap(array, i, min);
            swaps++;
            await delay();
            while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
            updateBars();
        }
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    displayPerformanceMetrics(comparisons, swaps, timeTaken);
}

async function mergeSort() {
    comparisons = 0;
    swaps = 0;
    const startTime = performance.now();
  
    await mergeSortHelper(0, array.length - 1);
  
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
  
    displayPerformanceMetrics(comparisons, swaps, timeTaken);
}

async function mergeSortHelper(startIdx, endIdx) {
    if (startIdx < endIdx) {
        const mid = Math.floor((startIdx + endIdx) / 2);
        await mergeSortHelper(startIdx, mid);
        await mergeSortHelper(mid + 1, endIdx);
        await merge(startIdx, mid, endIdx);
        await delay();
        while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
        updateBars();
    }
}

async function merge(startIdx, mid, endIdx) {
    const leftArray = array.slice(startIdx, mid + 1);
    const rightArray = array.slice(mid + 1, endIdx + 1);
    let leftIdx = 0,
        rightIdx = 0,
        arrayIdx = startIdx;

    while (leftIdx < leftArray.length && rightIdx < rightArray.length) {
        comparisons++;
        if (leftArray[leftIdx] <= rightArray[rightIdx]) {
            array[arrayIdx++] = leftArray[leftIdx++];
        } else {
            array[arrayIdx++] = rightArray[rightIdx++];
        }
    }

    while (leftIdx < leftArray.length) {
        array[arrayIdx++] = leftArray[leftIdx++];
        comparisons++;
    }

    while (rightIdx < rightArray.length) {
        array[arrayIdx++] = rightArray[rightIdx++];
        comparisons++;
    }
  
    swaps += (leftArray.length + rightArray.length);
}

async function quickSort() {
    let metrics = { comparisons: 0, swaps: 0 };
    const startTime = performance.now();
  
    await quickSortHelper(0, array.length - 1, metrics);
  
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
  
    displayPerformanceMetrics(metrics.comparisons, metrics.swaps, timeTaken);
}

async function quickSortHelper(startIdx, endIdx, metrics) {
    if (startIdx < endIdx) {
        const pivotIdx = await partition(startIdx, endIdx, metrics);
        await quickSortHelper(startIdx, pivotIdx - 1, metrics);
        await quickSortHelper(pivotIdx + 1, endIdx, metrics);
    }
}

async function partition(startIdx, endIdx, metrics) {
    const pivot = array[endIdx];
    let i = startIdx - 1;

    for (let j = startIdx; j < endIdx; j++) {
        metrics.comparisons++;
        if (array[j] < pivot) {
            i++;
            swap(array, i, j);
            metrics.swaps++;
            await delay();
            while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
            updateBars();
        }
    }

    swap(array, i + 1, endIdx);
    metrics.swaps++;
    await delay();
    while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
    updateBars();

    return i + 1;
}

async function insertionSort() {
    comparisons = 0;
    swaps = 0;
    const startTime = performance.now();

    for (let i = 1; i < array.length; i++) {
        let currentValue = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > currentValue) {
            comparisons++;
            array[j + 1] = array[j];
            swaps++;
            await delay();
            while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
            updateBars();
            j--;
        }
        array[j + 1] = currentValue;
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    displayPerformanceMetrics(comparisons, swaps, timeTaken);
}

async function heapSort() {
    comparisons = 0;
    swaps = 0;
    const startTime = performance.now();

    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        const result = await heapify(n, i, comparisons, swaps);
        comparisons = result.comparisons;
        swaps = result.swaps;
    }

    for (let i = n - 1; i > 0; i--) {
        swap(array, 0, i);
        swaps++;
        await delay();
        while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
        updateBars();

        const result = await heapify(i, 0, comparisons, swaps);
        comparisons = result.comparisons;
        swaps = result.swaps;
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    displayPerformanceMetrics(comparisons, swaps, timeTaken);
}

async function heapify(n, i, comparisons, swaps) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
        comparisons++;
        if (array[left] > array[largest]) {
            largest = left;
        }
    }

    if (right < n) {
        comparisons++;
        if (array[right] > array[largest]) {
            largest = right;
        }
    }

    if (largest !== i) {
        swap(array, i, largest);
        swaps++;
        await delay();
        while (isPaused) await new Promise(resolve => setTimeout(resolve, 100));
        updateBars();

        const result = await heapify(n, largest, comparisons, swaps);
        comparisons = result.comparisons;
        swaps = result.swaps;
    }

    return { comparisons, swaps };
}

// Initialize array on page load
generateArray();
