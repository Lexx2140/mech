<?php defined('BASEPATH') or exit('No direct script access allowed');

if (!function_exists('key_unset'))
{
    function key_unset($array, $keys)
    {
        $keys = explode(', ', $keys);

        foreach ($keys as $key => $value)
        {
            if (array_key_exists($value, $array))
            {
                unset($array[$value]);
            }
        }
        return $array;
    }
}
