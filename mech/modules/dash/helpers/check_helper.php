<?php defined('BASEPATH') or exit('No direct script access allowed');

// ----------------------------------------------------------------- CHECK IF IS JSON
if (!function_exists('copy_check'))
{
    function is_json($string = null)
    {
        return is_string($string) && is_array(json_decode($string, true)) && (json_last_error() == JSON_ERROR_NONE) ? true : false;
    }
}

// ------------------------------------------------------------------------ CHECK FOR COPY
if (!function_exists('copy_check'))
{
    function copy_check($old, $new, $count_new, $cat = null)
    {
        if ($old !== $new && $count_new > 0)
        {
            $msg = 'Неможливо виконати операцію:<br>';
            exit($msg . '"' . $new . '" вже існує!');
        }
        return true;
    }
}

//=== CHECK IF EXIST
if (!function_exists('copy_level_check'))
{
    function copy_level_check($old = null, $new, $nbs, $check)
    {
        foreach ($nbs as $nb)
        {
            if ($nb[$check] === $new[$check])
            {
                copy_check($old[$check], $new[$check], 1);
            }
        }
        return true;
    }
}

//=== NOT EMPTY PARENT CHECK
if (!function_exists('cat_check'))
{
    function cat_check($array)
    {
        if (count($array) > 0)
        {
            exit('Категорія містить дочірні елементи!');
        }
        return true;
    }
}
