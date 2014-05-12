<?php

class blacklist extends CI_Model{
    
    function is_clean() {
        $blacklisted_times = $this->blacklist->retrieve(
            array(
                'ip_address' => $_SERVER['REMOTE_ADDR'],
                'last_updated >' => date('Y-m-d H:i:s', time() - 7200)
            )
        );

        if ( count($blacklisted_times) == 0 ) { 
            return true;
        } else {
            // Is this an asshole? Ban for 2 hours
            return false;
        }  
    }

    // BEGIN BASIC CRUD FUNCTIONALITY

    function create( $data = array() ){
        $this->db->insert('blacklist', $data);    
        return $this->db->insert_id();
    }

    function retrieve( $data = array() ){
        $this->db->where($data);
        $query = $this->db->get('blacklist');
        return $query->result();
    }
    
    function update( $criteria = array(), $new_data = array() ){
        $this->db->where($criteria);
        $this->db->update('blacklist', $new_data);
    }
    
    function delete( $data = array() ){
        $this->db->where($data);
        $this->db->delete('blacklist');
    }

}

?>