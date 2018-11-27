<?php defined('BASEPATH') or exit('No direct script access allowed');

class Compress_lib
{
    public function minify_html($html)
    {
        // Clean tabs, feeds and returns
        $html = str_replace(["\t", "\r", "\n"], '', $html);

        // This is over twice the speed of a RegExp
        // (removes > 2 spaces and concatentate strings if there are 2 spaces between them)
        while (strpos($html, '  ') !== false)
        {
            $html = str_replace('  ', '', $html);
        }

        // while (strpos($html, '  ') !== false)
        // {
        //     $html = str_replace('  ', '', $html);
        // }
        //
        // $text = preg_replace('|[\s]+|s', ' ', $text1);


        $search = array(
            '#(?://)?<!\[CDATA\[(.*?)(?://)?\]\]>#s', //leave CDATA alone
            '/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s' // Remove html comments
        );

        $replace = array(
            "//&lt;![CDATA[\n" . '\1' . "\n//]]>",
            ''
        );

        return preg_replace($search, $replace, $html);
    }
}
