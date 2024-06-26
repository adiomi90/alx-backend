#!/usr/bin/env python3
""" FIFOCache module """
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFOCache class that inherits from BaseCaching.
    Implements a First-In-First-Out (FIFO) caching algorithm.
    """

    def __init__(self):
        """
        Initializes an instance of the FIFOCache class.
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """
        Adds an item to the cache.

        Args:
            key: The key of the item.
            item: The item to be added.

        Returns:
            None
        """
        if key is None or item is None:
            pass
        else:
            length = len(self.cache_data)
            if length >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.order[0]))
                del self.cache_data[self.order[0]]
                del self.order[0]
            self.order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves an item from the cache.

        Args:
            key: The key of the item to be retrieved.

        Returns:
            The item associated with the given key,
            or None if the key is not found.
        """
        if key is not None and key in self.cache_data.keys():
            return self.cache_data[key]
        return None
