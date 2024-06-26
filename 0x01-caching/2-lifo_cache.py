#!/usr/bin/env python3
""" LIFOCache module """
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFOCache class that inherits from BaseCaching.

    Attributes:
        order (list): A list to keep track of the order of keys in the cache.

    Methods:
        put(key, item): Adds an item to the cache.
        get(key): Retrieves an item from the cache.
    """

    def __init__(self):
        """
        Initializes a new instance of the LIFOCache class.
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """
        Adds an item to the cache.

        Args:
            key: The key of the item.
            item: The item to be added to the cache.
        """
        if key is None or item is None:
            pass
        else:
            length = len(self.cache_data)
            if length >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.order[-1]))
                del self.cache_data[self.order[-1]]
                del self.order[-1]
            if key in self.order:
                del self.order[self.order.index(key)]
            self.order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves an item from the cache.

        Args:
            key: The key of the item to retrieve.

        Returns:
            The item associated with the given key, or None if the key is not found.
        """
        if key is not None and key in self.cache_data.keys():
            return self.cache_data[key]
        return None
