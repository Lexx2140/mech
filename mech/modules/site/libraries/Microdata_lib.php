<?php defined('BASEPATH') or exit('No direct script access allowed');

class Microdata_lib
{
    public function render_ljson($app, $contacts)
    {
        $md['logo']  = null;
        $md['address']  = null;
        $md['open']  = null;
        $md['tel']   = null;
        $md['email'] = null;
        $md['sameas'] = null;

        // Set logo
        if (isset($app['logo_path']))
        {
            $md['logo'] = '"logo" : "' . $app['logo_path'] . '",' . "\n";
            $md['logo'] .= '"image" : "' . $app['logo_path'] . '",' . "\n";
        }

        // Set telephone(s)
        if (isset($contacts['tels']) && !empty($contacts['tels'][0]))
        {
            $md['tel'] = '"telephone": [';
            $tel_count = count($contacts['tels']);

            for ($i = 0; $i < $tel_count; $i++)
            {
                if ($i !== $tel_count - 1)
                {
                    $md['tel'] .= "\n" . '"' . $contacts['tels'][$i]['tel'] . '",';
                }
                else
                {
                    $md['tel'] .= "\n" . '"' . $contacts['tels'][$i]['tel'] . '"';
                }
            }

            $md['tel'] .= "\n" . '],';
        }

        // Set email(s)
        if (isset($contacts['emails']) && !empty($contacts['emails'][0]))
        {
            $md['email'] = '"email": [';
            $email_count = count($contacts['emails']);

            for ($i = 0; $i < $email_count; $i++)
            {
                if ($i !== $email_count - 1)
                {
                    $md['email'] .= "\n" . '"' . $contacts['emails'][$i] . '",';
                }
                else
                {
                    $md['email'] .= "\n" . '"' . $contacts['emails'][$i] . '"';
                }
            }

            $md['email'] .= "\n" . '],';
        }

        // Set address(s)
        if (isset($contacts['address']) && !empty($contacts['address']))
        {
            $md['address'] = '"address" : "' . $app['address'] . '",' . "\n";
        }

        // Set open hour(s)
        if (isset($contacts['open']) && !empty($contacts['open']))
        {
            $md['open'] = '"openingHours" : "' . $app['open'] . '",' . "\n";
        }

        // Set social network(s)
        if (isset($contacts['social']) && !empty($contacts['social'][0]))
        {
            $md['sameas'] = '"sameAs": [';
            $social_count = count($contacts['social']);

            for ($i = 0; $i < $social_count; $i++)
            {
                if ($i !== $social_count - 1)
                {
                    $md['sameas'] .= "\n" . '"' . $contacts['social'][$i]['href'] . '",';
                }
                else
                {
                    $md['sameas'] .= "\n" . '"' . $contacts['social'][$i]['href'] . '"';
                }
            }

            $md['sameas'] .= "\n" . ']';
        }

        return $md;
    }
}
