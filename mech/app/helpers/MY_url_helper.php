<?php defined('BASEPATH') or exit('No direct script access allowed');

function safe_mailto($email, $title = '', $attributes = '')
{
    $title = (string) $title;

    if ($title === '')
    {
        $title = $email;
    }

    $x = str_split('<a href="mailto:', 1);

    for ($i = 0, $l = strlen($email); $i < $l; $i++)
    {
        $x[] = '|' . ord($email[$i]);
    }

    $x[] = '"';

    if ($attributes !== '')
    {
        if (is_array($attributes))
        {
            foreach ($attributes as $key => $val)
            {
                $x[] = ' ' . $key . '="';
                for ($i = 0, $l = strlen($val); $i < $l; $i++)
                {
                    $x[] = '|' . ord($val[$i]);
                }
                $x[] = '"';
            }
        }
        else
        {
            for ($i = 0, $l = strlen($attributes); $i < $l; $i++)
            {
                $x[] = $attributes[$i];
            }
        }
    }

    $x[] = '>';

    $temp = array();
    for ($i = 0, $l = strlen($title); $i < $l; $i++)
    {
        $ordinal = ord($title[$i]);

        if ($ordinal < 128)
        {
            $x[] = '|' . $ordinal;
        }
        else
        {
            if (count($temp) === 0)
            {
                $count = ($ordinal < 224) ? 2 : 3;
            }

            $temp[] = $ordinal;

            if (count($temp) === $count)
            {
                $number = ($count === 3)
                    ? (($temp[0] % 16) * 4096) + (($temp[1] % 64) * 64) + ($temp[2] % 64)
                    : (($temp[0] % 32) * 64) + ($temp[1] % 64);
                $x[]   = '|' . $number;
                $count = 1;
                $temp  = array();
            }
        }
    }

    $x[] = '<';
    $x[] = '/';
    $x[] = 'a';
    $x[] = '>';

    $x = array_reverse($x);

    $output = "<script>"
        . "//<![CDATA[\n"
        . "var l=new Array();";

    for ($i = 0, $c = count($x); $i < $c; $i++)
    {
        $output .= "l[" . $i . "]='" . $x[$i] . "';";
    }

    $output .= "for (var i = l.length-1; i >= 0; i=i-1) {"
        . "if (l[i].substring(0, 1) === '|') document.write(\"&#\"+unescape(l[i].substring(1))+\";\");"
        . "else document.write(unescape(l[i]));"
        . "}"
        . "//]]>\n"
        . '</script>';

    return $output;
}
