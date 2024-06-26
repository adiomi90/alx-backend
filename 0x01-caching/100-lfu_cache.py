#!/usr/bin/env python3
""" LFUCache module """
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    LFUCache class that inherits from BaseCaching
    """

    def __init__(self):
        """
        Initialize LFUCache instance
        """
        super().__init__()
        self.usage = []  # List to track the usage of cache items
        self.frequency = {}  # Dictionary to track the frequency of cache items

    def put(self, key, item):
        """
        Cache a key-value pair in the LFUCache
        """
        if key is None or item is None:
            pass
        else:
            length = len(self.cache_data)
            if length >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                # Find the least frequently used (LFU) cache item(s)
                lfu = min(self.frequency.values())
                lfu_keys = []
                for k, v in self.frequency.items():
                    if v == lfu:
                        lfu_keys.append(k)
                if len(lfu_keys) > 1:
                    # If there are multiple LFU items,
                    # find the least recently used (LRU) among them
                    lru_lfu = {}
                    for k in lfu_keys:
                        lru_lfu[k] = self.usage.index(k)
                    discard = min(lru_lfu.values())
                    discard = self.usage[discard]
                else:
                    discard = lfu_keys[0]

                print("DISCARD: {}".format(discard))
                # Remove the LFU item from the cache
                del self.cache_data[discard]
                del self.usage[self.usage.index(discard)]
                del self.frequency[discard]

            # Update the usage frequency of the cache item
            if key in self.frequency:
                self.frequency[key] += 1
            else:
                self.frequency[key] = 1
            if key in self.usage:
                del self.usage[self.usage.index(key)]
            self.usage.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve a value from the LFUCache based on the given key
        """
        if key is not None and key in self.cache_data.keys():
            # Update the usage and frequency of the cache item
            del self.usage[self.usage.index(key)]
            self.usage.append(key)
            self.frequency[key] += 1
            return self.cache_data[key]
        return None
