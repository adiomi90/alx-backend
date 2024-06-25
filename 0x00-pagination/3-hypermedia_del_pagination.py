#!/usr/bin/env python3
""" this script makes two integer argument page and page_size"""
import csv
import math
from typing import List, Dict


class Server:
    """
    Represents a server that provides access to a dataset.
    """

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """
        Retrieves the dataset from the data file.

        Returns:
            A list of lists representing the dataset.
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """
        Retrieves the indexed dataset.

        Returns:
            A dictionary where the keys are the indices and
            the values are the corresponding dataset rows.
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Retrieves a hypermedia index from the dataset.

        Args:
            index: The starting index.
            page_size: The number of rows to retrieve.

        Returns:
            A dictionary containing the index, data, page size,
            and next index (if available).
        """
        dataset = self.indexed_dataset()
        data_length = len(dataset)
        assert 0 <= index < data_length
        response = {}
        data = []
        response['index'] = index
        for i in range(page_size):
            curr = dataset.get(index)
            if curr:
                data.append(curr)
            index += 1

        response['data'] = data
        response['page_size'] = len(data)
        if dataset.get(index):
            response['next_index'] = index
        else:
            response['next_index'] = None
        return response
