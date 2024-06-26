#!/usr/bin/env python3
""" BaseCaching module

This module contains the implementation of the BasicCache class,
which is a subclass of BaseCaching.
BasicCache provides basic caching functionality by implementing
the put and get methods.

"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    BasicCache class represents a basic caching implementation.

    Attributes:
        cache_data (dict): A dictionary to store the cached data.

    Methods:
        put(key, item): Adds an item to the cache with the specified key.
        get(key): Retrieves the item from the cache with the specified key.
    """

    def __init__(self):
        super().__init__()

    def put(self, key, item):
        """
        Adds an item to the cache with the specified key.

        Args:
            key: The key to associate with the item.
            item: The item to be cached.

        Returns:
            None
        """
        if key is None or item is None:
            pass
        else:
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the item from the cache with the specified key.

        Args:
            key: The key associated with the item.

        Returns:
            The item associated with the key,
            or None if the key is not found in the cache.
        """
        if key is not None and key in self.cache_data.keys():
            return self.cache_data[key]
        return None
