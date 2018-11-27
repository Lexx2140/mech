<?php defined('BASEPATH') or exit('No direct script access allowed');

// Loads any file as text in html
if (!function_exists('load_inline'))
{
    function load_inline($path)
    {
        if (is_file(APPPATH . '../../' . $path))
        {
            echo file_get_contents(base_url($path));
        }
    }
}

// Currency converter
if (!function_exists('currency_converter'))
{
    function currency_converter($curr)
    {
        $url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

        $curl = curl_init($url);

        if ($curl)
        {
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $curs = json_decode(curl_exec($curl), true);
            curl_close($curl);
            unset($curl);

            $ccy = 1;

            if ($curs && is_array($curs))
            {

                // GET CURRENT WORKING CURENCY
                foreach ($curs as $cur)
                {
                    if ($cur['ccy'] === $curr)
                    {
                        $ccy = round($cur['sale'], 2);
                    }
                }
            }

            return $ccy;
        }
    }
}

// Currency converter
if (!function_exists('curr2base_curr'))
{
    function curr2base_curr($num, $kurs)
    {
        return ($num * $kurs);
    }
}
