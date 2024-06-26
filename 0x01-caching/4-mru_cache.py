#!/usr/bin/env python3
""" MRUCache module """
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """
    Most Recently Used (MRU) Cache implementation.
    Inherits from the BaseCaching class.
    """

    def __init__(self):
        """
        Initializes an instance of the MRUCache class.
        """
        super().__init__()
        self.usage = []

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
                print("DISCARD: {}".format(self.usage[-1]))
                del self.cache_data[self.usage[-1]]
                del self.usage[-1]
            if key in self.usage:
                del self.usage[self.usage.index(key)]
            self.usage.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves an item from the cache.

        Args:
            key: The key of the item to retrieve.

        Returns:
            The item associated with the key, or None if the key is not found.
        """
        if key is not None and key in self.cache_data.keys():
            del self.usage[self.usage.index(key)]
            self.usage.append(key)
            return self.cache_data[key]
        return None
