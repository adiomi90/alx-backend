#!/usr/bin/env python3
""" LRUCache module """
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    A class representing a Least Recently Used (LRU) Cache.

    Inherits from the BaseCaching class.
    """

    def __init__(self):
        """
        Initialize an instance of the LRUCache class.

        Usage list is initialized to keep track of the order of item usage.
        """
        super().__init__()
        self.usage = []

    def put(self, key, item):
        """
        Add an item to the cache.

        If the cache is full, the least recently used item is discarded.

        Args:
            key: The key of the item.
            item: The item to be added to the cache.
        """
        if key is None or item is None:
            pass
        else:
            length = len(self.cache_data)
            if length >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.usage[0]))
                del self.cache_data[self.usage[0]]
                del self.usage[0]
            if key in self.usage:
                del self.usage[self.usage.index(key)]
            self.usage.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve an item from the cache.
        If the item exists in the cache, it is
        moved to the end of the usage list.

        Args:
            key: The key of the item to retrieve.

        Returns:
            The item associated with the key if it exists
            in the cache, None otherwise.
        """
        if key is not None and key in self.cache_data.keys():
            del self.usage[self.usage.index(key)]
            self.usage.append(key)
            return self.cache_data[key]
        return None
