<?php

class activity_log extends CI_Model{
    
    function tap( $type = '' ){
        $ip = $_SERVER['REMOTE_ADDR'];

        $this->activity_log->create(
            array(
                'type' => $type,
                'ip_address' => $ip
            )
        );

        $period = date('Y-m-d H:i:s', time() - 2); // 2 seconds ago
        $transactions = $this->activity_log->retrieve(
            array(
                'type' => $type,
                'ip_address' => $ip,
                'last_updated >' => $period
            )
        );

        if ( count($transactions) > 3 ) {
            // Person made 3 changes in 2 seconds
            // Is this an asshole? Ban for 2 hours
            $this->blacklist->create(
                array(
                    'ip_address' => $ip
                )
            );
        }
        
        return;
    }

    // BEGIN BASIC CRUD FUNCTIONALITY

    function create( $data = array() ){
        $this->db->insert('activity_log', $data);    
        return $this->db->insert_id();
    }

    function retrieve( $data = array() ){
        $this->db->where($data);
        $query = $this->db->get('activity_log');
        return $query->result();
    }
    
    function update( $criteria = array(), $new_data = array() ){
        $this->db->where($criteria);
        $this->db->update('activity_log', $new_data);
    }
    
    function delete( $data = array() ){
        $this->db->where($data);
        $this->db->delete('activity_log');
    }

}

?>